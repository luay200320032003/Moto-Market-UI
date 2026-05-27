import API from "../api";

export interface RegisterIndividualPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterDealerPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dealershipName: string;
  phone: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
}

const individualEndpoint =
  import.meta.env.VITE_AUTH_REGISTER_INDIVIDUAL_ENDPOINT ?? "/api/registration/individual";
const dealerEndpoint =
  import.meta.env.VITE_AUTH_REGISTER_DEALER_ENDPOINT ?? "/api/registration/dealer";

const REGISTER_TIMEOUT = 60000;

export async function registerIndividual(payload: RegisterIndividualPayload): Promise<void> {
  await API.post(individualEndpoint, payload, { timeout: REGISTER_TIMEOUT });
}

export async function registerDealer(payload: RegisterDealerPayload): Promise<void> {
  await API.post(dealerEndpoint, payload, { timeout: REGISTER_TIMEOUT });
}
