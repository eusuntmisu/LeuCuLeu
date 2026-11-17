const banknotes = [
  { src: '/bani/1.png', weight: 500 },
  { src: '/bani/5.png', weight: 250 },
  { src: '/bani/10.png', weight: 120 },
  { src: '/bani/20.png', weight: 60 },
  { src: '/bani/50.png', weight: 30 },
  { src: '/bani/100.png', weight: 15 },
  { src: '/bani/200.png', weight: 5 },
  { src: '/bani/500.png', weight: 1 } 
];

export function getRandomBanknote() {
  const totalWeight = banknotes.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let note of banknotes) {
    if (random < note.weight) {
      return note.src;
    }
    random -= note.weight;
  }
}