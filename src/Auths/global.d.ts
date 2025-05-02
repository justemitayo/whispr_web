interface Auth {
  token?: string;
  user?: {
    email?: string;
    user_id?: string;
    user_name?: string;
    full_name?: string;
    phone_number?: string;
    bio?: string;
    joined?: string;
    profile_picture?: string;
  };
}

interface ServerPaginationRequest {
  page?: number;
  limit?: number;
}
interface ServerPaginationResponse<T> {
  items: T[];
  page: {
    total_page: number;
    current_page: number;
    next_page: number;
  };
}

interface ServerResponse<T> {
  status: number;
  msg?: string;
  data?: T;
}
