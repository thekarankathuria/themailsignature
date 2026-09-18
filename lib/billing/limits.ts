/**
 * Plan limits, kept free of imports on purpose.
 *
 * Both the browser (pricing page, checkout form) and the server (the
 * subscription code) need these numbers, so this module must not reach the
 * database layer: importing it into a client component would pull node:sqlite
 * into the browser bundle and fail the build.
 */
export const MIN_BUSINESS_SEATS = 3;

export const MAX_SEATS = 200;
