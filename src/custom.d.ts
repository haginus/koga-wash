import { User as CustomUser } from "./users/entities/user.entity";

declare global {
   namespace Express {
      interface User extends CustomUser {
      }
   }
}