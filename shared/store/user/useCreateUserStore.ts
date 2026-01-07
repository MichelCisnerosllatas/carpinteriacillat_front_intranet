//shared/store/user/useCreateUserStore.ts
import {toast} from "react-hot-toast";
import {create} from "zustand";
import {userCreateUserType} from "@/shared/types/user/userCreateUserType";
import {UserApi} from "@/features/users/api/UserApi";

type State = {
    isloading: boolean;
    errormessage: string;
}

type Actions = {
    create: (param: userCreateUserType) => Promise<number>
}

export const useCreateUserStore = create<State & Actions>((set, get) => ({
    isloading: false,
    errormessage: "",

    create: async (param: userCreateUserType) : Promise<number> => {
        try{
            set({
                isloading: true,
                errormessage: ""
            });

            const response = await UserApi.create_user(param);
            if(!response.success){
               throw new Error(response.message);
            }

            set({ isloading: false });
            return Number(response.data?.id) ?? 0;
        }
        catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            set({ isloading: false, errormessage: message });
            toast.error(message);
            return 0;
        }
    }
}));