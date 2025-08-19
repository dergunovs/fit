export const BASE_REPLY = {
  message: 'Ok',
};

export function paginatedReply<T>(data: T) {
  return { data, total: 2 };
}
