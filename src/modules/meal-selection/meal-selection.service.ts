import { Injectable, NotFoundException } from '@nestjs/common';
import { AvalebleVendors } from './dtos/meal-selection.dtos';
import { I18nContext } from 'nestjs-i18n';
import { KidsRepository } from '../kids/kids.repository';
import { VendorDayRepository } from '../foodchart/vendorday.repository';
import { CommonResponseService } from '@app/common/services';
import { CartRepository } from './cart.repository';
import { DishRepository } from 'src/api/v1/vendor/dish/dish.repository';
import { CreateCartDto } from './dtos/create-cart.dtos';
import { CreateCartItemDto } from './dtos/create-cart-item.dtos';
import { ModifierRepository } from 'src/api/v1/vendor/modifier/modifier.repository';
import { FoodCategoryRepository } from 'src/api/v1/vendor/foodcategory/foodcategory.repository';

@Injectable()
export class MealSelectionService {


  constructor(
    private readonly kidsRepository: KidsRepository,
    private readonly venderDayRepository: VendorDayRepository,
    private readonly responseService: CommonResponseService,
    private readonly cartReposttory: CartRepository,
    private readonly dishRepository: DishRepository,
    private readonly modifierRepository: ModifierRepository,
    private readonly foodCategoryRepository: FoodCategoryRepository,
  ) { }

  async getAvalebleVendors(
    queryData: AvalebleVendors,
    schoolId: string,
    i18n: I18nContext,
  ) {

    const result = await this.venderDayRepository.getFoodChartDataWithVendorsDetails({
      filter: { schoolAdminId: schoolId },
      startDate: queryData.startDate,
      endDate: queryData.endDate,
    });

    return this.responseService.success(
      i18n.translate('messages.vendorFetch'),
      result,
    );
  }

  //old projects findCartByParentAndKid but reusable
  async getCart(ids: Object, isCheckedOut = false) {
    return this.cartReposttory.getCart({
      ...ids,
      isCheckedOut
    });
  }

  async findCartById(id: string) {
    return this.cartReposttory.getCart({
      _id: id
    });
  }

  async createCart(createCartDto: CreateCartDto, kidId: string, schoolId: string, i18n: I18nContext) {
    const { userId, vendorId, cartItems, deliveryAddress, orderDate } =
      createCartDto;
    let updatedCartItems = [];
    let totalAmount = 0;
    let baseAmount = 0;
    // await this.kidDashboardService.findAndVerifyKid(parentId?.toString(), kidId?.toString())
    for (const item of cartItems) {
      // Fetch the dish from the database
      const dish = (
        await this.dishRepository.findById(item.dishId?.toString())
      )?.toObject();
      if (!dish) {
        throw new Error(`Dish with ID ${item.dishId} not found`);
      }

      // Calculate the total price for the dish
      let totalPrice = dish.pricing * item.quantity;
      baseAmount = dish.pricing;
      // Process modifiers if they exist
      let updatedModifiers = [];
      if (item.modifiers && item.modifiers.length > 0) {
        for (const modifier of item.modifiers) {
          // Fetch the modifier's associated dish
          const modifierDish = (
            await this.dishRepository.findById(modifier.dishId?.toString())
          )?.toObject();
          if (!modifierDish) {
            throw new Error(
              `Modifier dish with ID ${modifier.dishId} not found`,
            );
          }

          // Calculate modifier price
          const modifierPrice = modifierDish.pricing * item.quantity;
          totalPrice += modifierPrice;
          baseAmount += modifierDish.pricing;
          modifier.quantity = item.quantity;
          // Update modifier with calculated price and ensure quantity is set
          const updatedModifier = {
            modifierId: modifier.modifierId,
            dishId: modifier.dishId,
            price: modifierDish.pricing,
            quantity: item.quantity, // Use the same quantity as the item
          };

          updatedModifiers.push(updatedModifier);
        }
      }
      console.log(updatedModifiers);

      // Update cart item with calculated price and updated modifiers
      updatedCartItems.push({
        ...item,
        price: dish.pricing,
        modifiers: updatedModifiers,
      });

      baseAmount = baseAmount;
      totalAmount = totalPrice;
    }

    // Create the new cart
    const cart = this.cartReposttory.create({
      userId,
      kidId: kidId,
      vendorId,
      orderDate,
      schoolId: schoolId,
      cartItems: updatedCartItems,
      deliveryAddress,
      baseAmount,
      totalAmount, // Assign calculated total amount
    });

    return this.responseService.success(i18n.translate('messages.cartUpdate'), {
      cart,
    });
  }

  async updateCartItems(
    cartId: string,
    newItem: CreateCartItemDto,
    i18n: I18nContext,
  ) {
    const cart = await this.cartReposttory.findById(cartId);

    if (!cart) {
      throw new NotFoundException(i18n.translate('messages.cartNotFound'));
    }

    // Fetch the dish pricing dynamically from the database
    const dish = await this.dishRepository.findById(newItem.dishId?.toString());
    if (!dish) {
      throw new NotFoundException(
        i18n.translate('messages.dishNotFound', {
          args: { id: newItem.dishId },
        }),
      );
    }

    const calculatedDishPrice = dish.pricing * newItem.quantity;

    const existingItemIndex = cart.cartItems.findIndex(
      (item) => item.dishId.toString() === newItem.dishId.toString(),
    );

    if (existingItemIndex >= 0) {
      // Update the existing item's quantity, price, notes, and modifiers
      cart.cartItems[existingItemIndex].quantity += newItem.quantity;
      cart.cartItems[existingItemIndex].price = dish.pricing;
      cart.cartItems[existingItemIndex].notes =
        newItem.notes || cart.cartItems[existingItemIndex].notes;

      // Handle modifiers dynamically
      if (newItem.modifiers) {
        const existingModifiers =
          cart.cartItems[existingItemIndex].modifiers || [];
        for (const newModifier of newItem.modifiers) {
          const modifier = await this.modifierRepository.findById(
            newModifier.modifierId?.toString(),
          );
          if (!modifier) {
            throw new NotFoundException(
              i18n.translate('messages.modifierNotFound', {
                args: { id: newModifier.modifierId },
              }),
            );
          }
          const modifierDish = await this.dishRepository.findById(
            newModifier.dishId?.toString(),
          );

          const modifierIndex = existingModifiers.findIndex(
            (mod) =>
              mod.modifierId.toString() === newModifier.modifierId.toString(),
          );

          const calculatedModifierPrice =
            modifierDish.pricing * newItem.quantity;

          newModifier.quantity = newItem.quantity;
          if (modifierIndex >= 0) {
            // Update existing modifier
            existingModifiers[modifierIndex].quantity =
              (existingModifiers[modifierIndex].quantity || 1) +
              (newModifier.quantity || 1);
            existingModifiers[modifierIndex].price = calculatedModifierPrice;
          } else {
            // Add new modifier with calculated pricing
            existingModifiers.push({
              ...newModifier,
              price: calculatedModifierPrice,
            });
          }
        }
        cart.cartItems[existingItemIndex].modifiers = existingModifiers;
      }
    } else {
      // If the dish is not in the cart, add it as a new item
      const modifiers = [];
      if (newItem.modifiers) {
        for (const newModifier of newItem.modifiers) {
          const modifier = await this.modifierRepository.findById(
            newModifier.modifierId?.toString(),
          );
          if (!modifier) {
            throw new NotFoundException(
              i18n.translate('messages.modifierNotFound', {
                args: { id: newModifier.modifierId },
              }),
            );
          }
          const modifierDish = await this.dishRepository.findById(
            newModifier.dishId?.toString(),
          );

          const calculatedModifierPrice =
            modifierDish.pricing * newModifier.quantity;
          modifiers.push({
            ...newModifier,
            price: calculatedModifierPrice,
          });
        }
      }

      cart.cartItems.push({
        ...newItem,
        price: dish.pricing,
        modifiers,
      });
    }

    // Recalculate total amount, including modifiers
    cart.totalAmount = cart.cartItems.reduce((total, item) => {
      const modifiersTotal = (item.modifiers || []).reduce(
        (modTotal, mod) => modTotal + mod.price * (mod.quantity || 1),
        0,
      );
      return total + item.price * item.quantity + modifiersTotal;
    }, 0);

    const updatedCart = await cart.save();

    return this.responseService.success(
      i18n.translate('messages.cartUpdate'),
      updatedCart,
    );
  }

  async getVendorCategories(
    vendorId: string,
    // kidId: string,//remove kid id bcz same api used in staff
    i18n: I18nContext,
  ) {
    const result =
      await this.foodCategoryRepository.getFoodcategoryWithModifierAndDishes({
        vendorId,
      });
    // let kidData = await this.kidsDashboardService.getKidsSchoolAddressById(
    //   kidId,
    //   i18n,
    // );

    let data = {
      categories: result,
      // kids: kidData,
    };
    return this.responseService.success(
      i18n.translate('messages.vendorFetch'),
      { data },
    );
  }

  async getMenusDayWise(
    queryData: AvalebleVendors,
    schoolId: string,
    i18n: I18nContext,
  ) {

    const result = await this.venderDayRepository.find({
      schoolAdminId: schoolId,
      date: {
        $gte: queryData.startDate,
        $lte: queryData.endDate,
      },
    }); // Populate school admin details (if needed)
    const groupedByDayOfWeek = async (result) => {
      const results = await Promise.all(
        result.map(async (item) => {
          const categories =
            await this.foodCategoryRepository.getFoodcategoryWithModifierAndDishes(
              {
                vendorId: item.vendorId,
              },
            );

          item.categories = categories; // Add fetched categories to the item
          return { key: item.date, value: item }; // Return the key-value pair
        }),
      );

      // Transform the array into an object grouped by `date`
      return results.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {});
    };
    const grouped = await groupedByDayOfWeek(result);

    return this.responseService.success(
      i18n.translate('messages.vendorFetch'),
      grouped,
    );
  }

  async getDishDetails(dishId: string, modifierId: string, i18n: I18nContext) {
    const dish = await this.dishRepository.findById(dishId);
    const modifier =
      await this.modifierRepository.findByIdWithDishes(modifierId);

    if (!modifier) {
      throw new Error(i18n.translate('messages.modifierNotFound'));
    }
    const ingredients = dish.ingredients; // Access the ingredients field

    const ingredientsList = modifier.dishIds.map(
      (dish) => dish.ingredients || [],
    );
    const newingredientsList = ingredientsList.flat();
    // Merge and sum quantities
    const ingredientMap = new Map<string, number>();

    // Add ingredients from the `dish`
    for (const ingredient of ingredients) {
      const existingQuantity = ingredientMap.get(ingredient.name) || 0;
      ingredientMap.set(
        ingredient.name,
        existingQuantity + ingredient.quantity,
      );
    }

    // Add ingredients from the `ingredientsList`
    for (const ingredient of newingredientsList) {
      const existingQuantity = ingredientMap.get(ingredient.name) || 0;
      ingredientMap.set(
        ingredient.name,
        existingQuantity + ingredient.quantity,
      );
    }

    // Convert the map back to an array of ingredients
    const mergedIngredients = Array.from(ingredientMap.entries()).map(
      ([name, quantity]) => ({
        name,
        quantity,
      }),
    );

    // Optionally remove duplicates if needed
    const uniqueIngredients = Array.from(new Set(mergedIngredients));
    let data = {
      dish: dish,
      modifier: modifier,
      ingredients: uniqueIngredients,
    };
    return this.responseService.success(
      i18n.translate('messages.vendorFetch'),
      data,
    );
  }



}
