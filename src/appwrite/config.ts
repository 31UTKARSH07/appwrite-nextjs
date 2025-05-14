import conf from "@/conf/config";
import { Client, Account, ID } from "appwrite";
import { get } from "http";

type CreateUserAccount = {
    email: string;
    password: string;
    name: string;
}
type LoginUserAccount = {
    email: string;
    password: string;
}
const appwriteClient = new Client();
appwriteClient.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);

export const account = new Account(appwriteClient);

export class AppWriteService {
    //create a new record of user inside appwrite
    async createUserAccount({ email, password, name }: CreateUserAccount) {
        try {
            const userAccount = await account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({ email, password });
            }
        } catch (error: any) {
            throw error;
        }


    }
    async login({ email, password }: LoginUserAccount) {
        try {
            return await account.createEmailPasswordSession(email, password)
        } catch (error: any) {
            throw error;
        }
    }
    async isLoggedIn(): Promise<boolean>{ 
        try{
            const data = await this.getCurrentUser();
            return Boolean(data);
        }catch(error: any) {

        }
        return false;
    }
    async getCurrentUser() {
        try{
            return account.get();
        }catch(error){
            console.log("getCurrentUser error", error);
            throw error;
        }
        return null;
     }
    async logout() {
        try{
            return await account.deleteSession("current");
        }catch(error){
            console.log("logout error", error);
            throw error;
        }
     }
}

const appwriteService = new AppWriteService();
export default appwriteService;
