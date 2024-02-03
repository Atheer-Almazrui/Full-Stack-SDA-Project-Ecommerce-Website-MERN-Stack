export const sortItems = (sort: string) => {
  let sortOption = {}

  switch (sort) {
    case 'nameAZ':
      sortOption = { name: 1 }
      break
    case 'nameZA':
      sortOption = { name: -1 }
      break
    case 'oldest':
      sortOption = { createdAt: 1 }
      break
    case 'newest':
      sortOption = { createdAt: -1 }
      break
    case 'priceASC':
      sortOption = { price: 1 }
      break
    case 'priceDESC':
      sortOption = { price: -1 }
      break
    default:
      break
  }

  return sortOption
}
