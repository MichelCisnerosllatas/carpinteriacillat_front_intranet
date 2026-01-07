// shared/store/user/useUpdateUserStore.ts
import { toast } from "react-hot-toast";
import { create } from "zustand";
import { UserApi } from "@/features/users/api/UserApi";
import type { userCreateUserType } from "@/shared/types/user/userCreateUserType";

type State = {
    isloading: boolean;
    errormessage: string;
};

type Actions = {
    update: (id: number, param: userCreateUserType) => Promise<boolean>;
};

export const useUpdateUserStore = create<State & Actions>((set) => ({
    isloading: false,
    errormessage: "",

    update: async (id, param) => {
        try {
            set({ isloading: true, errormessage: "" });

            const response = await UserApi.update(id, param);
            // if (!response.success) throw new Error(response.message);
            //
            // set({ isloading: false });
            return true;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            set({ isloading: false, errormessage: message });
            toast.error(message);
            return false;
        }
    },
}));
