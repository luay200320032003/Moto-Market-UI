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
  import.meta.env.VITE_AUTH_REGISTER_INDIVIDUAL_ENDPOINT ?? "/api/auth/register/individual";
const dealerEndpoint =
  import.meta.env.VITE_AUTH_REGISTER_DEALER_ENDPOINT ?? "/api/auth/register/dealer";

export async function registerIndividual(payload: RegisterIndividualPayload): Promise<void> {
  await API.post(individualEndpoint, payload);
}

export async function registerDealer(payload: RegisterDealerPayload): Promise<void> {
  await API.post(dealerEndpoint, payload);
}
