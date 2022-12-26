import { User as CustomUser } from "./users/schemas/user.schema";

declare global {
   namespace Express {
      interface User extends CustomUser {
      }
   }
}