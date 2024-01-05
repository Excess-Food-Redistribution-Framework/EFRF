export function getOrgBadge(ranking: number): string {
  switch (ranking) {
    case 1:
      return './assets/img/1_donor.png';
    case 2:
      return './assets/img/2_donor.png';
    case 3:
      return './assets/img/3_donor.png';
    default:
      return './assets/img/donor.png';
  }
}

export default getOrgBadge;
