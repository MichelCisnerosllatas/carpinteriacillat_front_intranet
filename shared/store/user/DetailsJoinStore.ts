import {create} from "zustand";
import {UserJoinEntity} from "@/entity/user/userjoin/UserJoinEntity";
import {UserApi} from "@/features/users/api/UserApi";

type State = {
    isloading: boolean;
    user: UserJoinEntity | null
}

type Actions = {
    fetch: ({id} : {id: number}) => Promise<void>;
}

export const useDetailsUserJoinStore = create<State & Actions>((set, get) => ({
    user: null,
    isloading: false,

    fetch: async ({id} : {id: number}) => {
        try{
            set({
                isloading: true
            });
            const result = await UserApi.details_user(id);
            if(result.success){

            }
        }
        catch (error: any) {

        }
    }
}));
