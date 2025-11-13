export const ERROR_MESSAGES = {
  NOT_FOUND: 'Resource not found.',
  USER_ALREADY_EXISTS: 'A user with this email or username already exists.',
  USER_NOT_AUTHENTICATED: 'User is not authenticated.',
  USER_CONFLICT:
    'The provided name or email is already in use by another user.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  OFFER_OWN_DENY: 'You cannot make an offer on your own wish.',
  OFFER_PRICE: 'Offer exceeds the maximum allowed price.',
  WISH_COPY: 'You cannot copy your own wish.',
  WISH_NOT_OWN_UPDATE: 'You cannot update someone else’s wish.',
  WISH_WILLING_CHANGE_PRICE:
    'Cannot change the price once other participants have committed to contribute.',
  WISH_REMOVE: 'You cannot remove someone else’s wish.',
  WISHLIST_UPDATE: 'You cannot update someone else’s wishlist.',
  WISHLIST_DELETE: 'You cannot delete someone else’s wishlist.',
} as const;
