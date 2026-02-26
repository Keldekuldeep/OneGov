// Government Portal Links Configuration

export interface UtilityLinks {
  electricity: string
  water: string
  ration: string
  pension: string
}

export interface RevenueLinks {
  land: string
  income: string
  caste: string
  domicile: string
}

export interface StateLinks {
  revenue: RevenueLinks
  utility: UtilityLinks
  name: string
}

export const statePortals: Record<string, StateLinks> = {
  'madhya-pradesh': {
    name: 'Madhya Pradesh',
    revenue: {
      land: 'https://mpbhulekh.gov.in',
      income: 'https://mpedistrict.gov.in',
      caste: 'https://mpedistrict.gov.in',
      domicile: 'https://mpedistrict.gov.in',
    },
    utility: {
      electricity: 'https://portal.mpcz.in',
      water: 'https://urban.mp.gov.in',
      ration: 'https://samagra.gov.in',
      pension: 'https://socialsecurity.mp.gov.in',
    },
  },
  'maharashtra': {
    name: 'Maharashtra',
    revenue: {
      land: 'https://bhulekh.mahabhumi.gov.in',
      income: 'https://aaplesarkar.mahaonline.gov.in',
      caste: 'https://aaplesarkar.mahaonline.gov.in',
      domicile: 'https://aaplesarkar.mahaonline.gov.in',
    },
    utility: {
      electricity: 'https://www.mahadiscom.in',
      water: 'https://mahapwd.gov.in',
      ration: 'https://aaplesarkar.mahaonline.gov.in',
      pension: 'https://sjsa.maharashtra.gov.in',
    },
  },
  'delhi': {
    name: 'Delhi',
    revenue: {
      land: 'https://dlrc.delhi.gov.in',
      income: 'https://edistrict.delhigovt.nic.in',
      caste: 'https://edistrict.delhigovt.nic.in',
      domicile: 'https://edistrict.delhigovt.nic.in',
    },
    utility: {
      electricity: 'https://www.bsesdelhi.com',
      water: 'https://www.delhijalboard.nic.in',
      ration: 'https://nfs.delhi.gov.in',
      pension: 'https://edistrict.delhigovt.nic.in',
    },
  },
  'uttar-pradesh': {
    name: 'Uttar Pradesh',
    revenue: {
      land: 'https://upbhulekh.gov.in',
      income: 'https://edistrict.up.gov.in',
      caste: 'https://edistrict.up.gov.in',
      domicile: 'https://edistrict.up.gov.in',
    },
    utility: {
      electricity: 'https://www.uppcl.org',
      water: 'https://upjn.org',
      ration: 'https://fcs.up.gov.in',
      pension: 'https://sspy-up.gov.in',
    },
  },
  'rajasthan': {
    name: 'Rajasthan',
    revenue: {
      land: 'https://apnakhata.raj.nic.in',
      income: 'https://emitra.rajasthan.gov.in',
      caste: 'https://emitra.rajasthan.gov.in',
      domicile: 'https://emitra.rajasthan.gov.in',
    },
    utility: {
      electricity: 'https://energy.rajasthan.gov.in',
      water: 'https://phed.rajasthan.gov.in',
      ration: 'https://food.raj.nic.in',
      pension: 'https://rajssp.raj.nic.in',
    },
  },
  'karnataka': {
    name: 'Karnataka',
    revenue: {
      land: 'https://landrecords.karnataka.gov.in',
      income: 'https://sevasindhu.karnataka.gov.in',
      caste: 'https://sevasindhu.karnataka.gov.in',
      domicile: 'https://sevasindhu.karnataka.gov.in',
    },
    utility: {
      electricity: 'https://bescom.karnataka.gov.in',
      water: 'https://bwssb.gov.in',
      ration: 'https://ahara.kar.nic.in',
      pension: 'https://sevasindhu.karnataka.gov.in',
    },
  },
  'tamil-nadu': {
    name: 'Tamil Nadu',
    revenue: {
      land: 'https://eservices.tn.gov.in',
      income: 'https://tnedistrict.gov.in',
      caste: 'https://tnedistrict.gov.in',
      domicile: 'https://tnedistrict.gov.in',
    },
    utility: {
      electricity: 'https://www.tangedco.gov.in',
      water: 'https://www.chennaimetrowater.tn.gov.in',
      ration: 'https://www.tnpds.gov.in',
      pension: 'https://www.tnpension.gov.in',
    },
  },
  'gujarat': {
    name: 'Gujarat',
    revenue: {
      land: 'https://anyror.gujarat.gov.in',
      income: 'https://digitalgujarat.gov.in',
      caste: 'https://digitalgujarat.gov.in',
      domicile: 'https://digitalgujarat.gov.in',
    },
    utility: {
      electricity: 'https://www.guvnl.com',
      water: 'https://guj-epds.gujarat.gov.in',
      ration: 'https://digitalgujarat.gov.in',
      pension: 'https://www.digitalgujarat.gov.in',
    },
  },
  'west-bengal': {
    name: 'West Bengal',
    revenue: {
      land: 'https://banglarbhumi.gov.in',
      income: 'https://wb.gov.in',
      caste: 'https://wb.gov.in',
      domicile: 'https://wb.gov.in',
    },
    utility: {
      electricity: 'https://www.wbsedcl.in',
      water: 'https://www.kmcgov.in',
      ration: 'https://wbpds.gov.in',
      pension: 'https://wb.gov.in',
    },
  },
  'telangana': {
    name: 'Telangana',
    revenue: {
      land: 'https://dharani.telangana.gov.in',
      income: 'https://meeseva.telangana.gov.in',
      caste: 'https://meeseva.telangana.gov.in',
      domicile: 'https://meeseva.telangana.gov.in',
    },
    utility: {
      electricity: 'https://www.tssouthernpower.com',
      water: 'https://www.hyderabadwater.gov.in',
      ration: 'https://epds.telangana.gov.in',
      pension: 'https://www.telangana.gov.in',
    },
  },
}

export const getStatesList = () => {
  return Object.entries(statePortals).map(([key, value]) => ({
    id: key,
    name: value.name,
  }))
}
