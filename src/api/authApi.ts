/**
 * Auth API (Mock)
 *
 * Simulates authentication API calls with network delay.
 * Can be easily swapped with a real API by changing the implementation.
 */

import { LoginCredentials, User } from '../types/health';
import { MOCK_USER, API_DELAY_MS } from '../utils/constants';

interface AuthResponse {
    user: User;
    token: string;
}

/**
 * Simulates network delay.
 */
const simulateDelay = (ms: number = API_DELAY_MS): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock login API call.
 * Validates credentials against hardcoded mock user.
 */
export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await simulateDelay();

    if (
        credentials.email.toLowerCase() === MOCK_USER.email.toLowerCase() &&
        credentials.password === MOCK_USER.password
    ) {
        return {
            user: {
                id: MOCK_USER.id,
                name: MOCK_USER.name,
                email: MOCK_USER.email,
            },
            token: `mock_jwt_token_${Date.now()}`,
        };
    }

    throw new Error('Invalid email or password. Please try again.');
};
