export class CityRequiredError extends Error {
  constructor() {
    super('City is required')
  }
}
