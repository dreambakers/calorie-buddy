import { environment } from '../environments/environment';

export const constants = {
    apiUrl: environment.production ? 'http://localhost:3000' : 'http://localhost:3000',
}