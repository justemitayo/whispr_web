export interface GetUsersRequest extends ServerPaginationRequest {
  search: string;
}
export interface GetUsersResponse extends ServerResponse<ServerPaginationResponse<Auth['user']>> {}
