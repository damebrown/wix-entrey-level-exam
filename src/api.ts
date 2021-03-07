import axios from 'axios';
import { APIRootPath } from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type ApiClient = {
    getTickets: (sortBy: string, page: number) => Promise<Ticket[]>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (sortBy: string, page: number) => {
            return axios.get(APIRootPath, { params: { sortBy: sortBy, page: page } }).then((res) => res.data);
        }
    }
}
