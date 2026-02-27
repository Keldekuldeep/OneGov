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
  'andhra-pradesh': {
    name: 'Andhra Pradesh',
    revenue: {
      land: 'https://meebhoomi.ap.gov.in',
      income: 'https://gramawardsachivalayam.ap.gov.in',
      caste: 'https://gramawardsachivalayam.ap.gov.in',
      domicile: 'https://gramawardsachivalayam.ap.gov.in',
    },
    utility: {
      electricity: 'https://www.apeasternpower.com',
      water: 'https://www.aponline.gov.in',
      ration: 'https://epds.ap.gov.in',
      pension: 'https://www.aponline.gov.in',
    },
  },
  'kerala': {
    name: 'Kerala',
    revenue: {
      land: 'https://erekha.kerala.gov.in',
      income: 'https://lsgkerala.gov.in',
      caste: 'https://lsgkerala.gov.in',
      domicile: 'https://lsgkerala.gov.in',
    },
    utility: {
      electricity: 'https://www.kseb.in',
      water: 'https://www.keralawater.gov.in',
      ration: 'https://civilsupplieskerala.gov.in',
      pension: 'https://www.pension.kerala.gov.in',
    },
  },
  'punjab': {
    name: 'Punjab',
    revenue: {
      land: 'https://jamabandi.punjab.gov.in',
      income: 'https://connect.punjab.gov.in',
      caste: 'https://connect.punjab.gov.in',
      domicile: 'https://connect.punjab.gov.in',
    },
    utility: {
      electricity: 'https://www.pspcl.in',
      water: 'https://www.pbwaterworks.gov.in',
      ration: 'https://epos.punjab.gov.in',
      pension: 'https://connect.punjab.gov.in',
    },
  },
  'haryana': {
    name: 'Haryana',
    revenue: {
      land: 'https://jamabandi.nic.in',
      income: 'https://saralharyana.gov.in',
      caste: 'https://saralharyana.gov.in',
      domicile: 'https://saralharyana.gov.in',
    },
    utility: {
      electricity: 'https://www.dhbvn.org.in',
      water: 'https://phed.haryana.gov.in',
      ration: 'https://haryanafood.gov.in',
      pension: 'https://pension.socialjusticehry.gov.in',
    },
  },
  'bihar': {
    name: 'Bihar',
    revenue: {
      land: 'https://biharbhumi.bihar.gov.in',
      income: 'https://serviceonline.bihar.gov.in',
      caste: 'https://serviceonline.bihar.gov.in',
      domicile: 'https://serviceonline.bihar.gov.in',
    },
    utility: {
      electricity: 'https://www.bsphcl.co.in',
      water: 'https://phed.bih.nic.in',
      ration: 'https://epds.bihar.gov.in',
      pension: 'https://serviceonline.bihar.gov.in',
    },
  },
  'odisha': {
    name: 'Odisha',
    revenue: {
      land: 'https://bhulekh.ori.nic.in',
      income: 'https://odishaonline.gov.in',
      caste: 'https://odishaonline.gov.in',
      domicile: 'https://odishaonline.gov.in',
    },
    utility: {
      electricity: 'https://www.tpcodl.com',
      water: 'https://www.phedodisha.gov.in',
      ration: 'https://pdsodisha.gov.in',
      pension: 'https://ssepd.gov.in',
    },
  },
  'jharkhand': {
    name: 'Jharkhand',
    revenue: {
      land: 'https://jharbhoomi.nic.in',
      income: 'https://jharsewa.jharkhand.gov.in',
      caste: 'https://jharsewa.jharkhand.gov.in',
      domicile: 'https://jharsewa.jharkhand.gov.in',
    },
    utility: {
      electricity: 'https://www.jbvnl.co.in',
      water: 'https://www.phed.jharkhand.gov.in',
      ration: 'https://aahar.jharkhand.gov.in',
      pension: 'https://jharsewa.jharkhand.gov.in',
    },
  },
  'chhattisgarh': {
    name: 'Chhattisgarh',
    revenue: {
      land: 'https://bhuiyan.cg.nic.in',
      income: 'https://edistrict.cgstate.gov.in',
      caste: 'https://edistrict.cgstate.gov.in',
      domicile: 'https://edistrict.cgstate.gov.in',
    },
    utility: {
      electricity: 'https://www.cspdcl.co.in',
      water: 'https://phed.cg.gov.in',
      ration: 'https://khadya.cg.nic.in',
      pension: 'https://sw.cg.gov.in',
    },
  },
  'assam': {
    name: 'Assam',
    revenue: {
      land: 'https://revenueassam.nic.in',
      income: 'https://online.assam.gov.in',
      caste: 'https://online.assam.gov.in',
      domicile: 'https://online.assam.gov.in',
    },
    utility: {
      electricity: 'https://www.apdcl.org',
      water: 'https://phe.assam.gov.in',
      ration: 'https://fcsca.assam.gov.in',
      pension: 'https://online.assam.gov.in',
    },
  },
  'uttarakhand': {
    name: 'Uttarakhand',
    revenue: {
      land: 'https://bhulekh.uk.gov.in',
      income: 'https://edistrict.uk.gov.in',
      caste: 'https://edistrict.uk.gov.in',
      domicile: 'https://edistrict.uk.gov.in',
    },
    utility: {
      electricity: 'https://www.upcl.org',
      water: 'https://peyjal.uk.gov.in',
      ration: 'https://fcs.uk.gov.in',
      pension: 'https://ssp.uk.gov.in',
    },
  },
  'himachal-pradesh': {
    name: 'Himachal Pradesh',
    revenue: {
      land: 'https://lrc.hp.nic.in',
      income: 'https://edistrict.hp.gov.in',
      caste: 'https://edistrict.hp.gov.in',
      domicile: 'https://edistrict.hp.gov.in',
    },
    utility: {
      electricity: 'https://www.hpseb.com',
      water: 'https://jalsewa.hp.gov.in',
      ration: 'https://epds.hp.nic.in',
      pension: 'https://edistrict.hp.gov.in',
    },
  },
  'jammu-kashmir': {
    name: 'Jammu & Kashmir',
    revenue: {
      land: 'https://landrecords.jk.gov.in',
      income: 'https://jkedistrict.nic.in',
      caste: 'https://jkedistrict.nic.in',
      domicile: 'https://jkedistrict.nic.in',
    },
    utility: {
      electricity: 'https://www.jkpdd.gov.in',
      water: 'https://jkphe.nic.in',
      ration: 'https://jkfcsca.gov.in',
      pension: 'https://jkedistrict.nic.in',
    },
  },
  'goa': {
    name: 'Goa',
    revenue: {
      land: 'https://egov.goa.nic.in',
      income: 'https://goaonline.gov.in',
      caste: 'https://goaonline.gov.in',
      domicile: 'https://goaonline.gov.in',
    },
    utility: {
      electricity: 'https://www.goaelectricity.gov.in',
      water: 'https://www.goawaterboard.gov.in',
      ration: 'https://goaonline.gov.in',
      pension: 'https://goaonline.gov.in',
    },
  },
}

export const getStatesList = () => {
  return Object.entries(statePortals).map(([key, value]) => ({
    id: key,
    name: value.name,
  }))
}
