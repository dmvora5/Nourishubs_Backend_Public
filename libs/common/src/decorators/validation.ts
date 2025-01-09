import { UsePipes } from "@nestjs/common";
import { CustomValidationPipe } from "../utils";


export function Validate() {
    return function (target: any, key: string | symbol, descriptor: PropertyDescriptor) {
      UsePipes(CustomValidationPipe)(target, key, descriptor);
    };
  }