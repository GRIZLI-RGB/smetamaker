import { createTRPCReact } from "@trpc/react-query";

import { AppRouter } from "./../../backend/src/trpc/procedures";

export const trpc = createTRPCReact<AppRouter>();
