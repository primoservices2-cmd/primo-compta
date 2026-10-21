export type Devise = 'USD' | 'CDF'

export const genererCodeEntree = () => {
  const y = new Date().getFullYear()
  const r = Math.floor(1000 + Math.random()*9000)
  return { enc: `ENC-E-${y}-${r}`, val: `VAL-E-${y}-${r}` }
}

export const genererCodeSortie = () => {
  const y = new Date().getFullYear()
  const r = Math.floor(1000 + Math.random()*9000)
  return { enc: `ENC-S-${y}-${r}`, val: `VAL-S-${y}-${r}`, dec: `DEC-S-${y}-${r}` }
}

export const calculerSoldes = (entrees: any[], sorties: any[]) => {
  const usdE = entrees.filter((e:any)=>e.devise==='USD' && e.status==='validated').reduce((s:number,e:any)=>s+Number(e.montant),0)
  const cdfE = entrees.filter((e:any)=>e.devise==='CDF' && e.status==='validated').reduce((s:number,e:any)=>s+Number(e.montant),0)
  const usdS = sorties.filter((s:any)=>s.devise==='USD' && s.status!=='encoded').reduce((s:number,e:any)=>s+Number(e.montant),0)
  const cdfS = sorties.filter((s:any)=>s.devise==='CDF' && s.status!=='encoded').reduce((s:number,e:any)=>s+Number(e.montant),0)
  return { soldeUSD: usdE - usdS, soldeCDF: cdfE - cdfS }
}
