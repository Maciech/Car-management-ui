export interface CarGeneration {
  code: string;       // np. "F30"
  label: string;      // np. "F30 (2012–2019)"
  minYear: number;
  maxYear: number;
  modelLine: string;  // nazwa dla CarQuery, np. "3 Series"
}

export const CAR_GENERATIONS: Record<string, CarGeneration[]> = {
  'BMW': [
    // 1 Series
    { code: 'E87', label: '1 Series E87 (2004–2011)', minYear: 2004, maxYear: 2011, modelLine: '1 Series' },
    { code: 'F20', label: '1 Series F20 (2011–2019)', minYear: 2011, maxYear: 2019, modelLine: '1 Series' },
    { code: 'F40', label: '1 Series F40 (2019–)',    minYear: 2019, maxYear: 2026, modelLine: '1 Series' },
    // 2 Series
    { code: 'F22', label: '2 Series F22 (2014–2021)', minYear: 2014, maxYear: 2021, modelLine: '2 Series' },
    { code: 'G42', label: '2 Series G42 (2021–)',    minYear: 2021, maxYear: 2026, modelLine: '2 Series' },
    // 3 Series
    { code: 'E36', label: '3 Series E36 (1990–2000)', minYear: 1990, maxYear: 2000, modelLine: '3 Series' },
    { code: 'E46', label: '3 Series E46 (1998–2006)', minYear: 1998, maxYear: 2006, modelLine: '3 Series' },
    { code: 'E90', label: '3 Series E90 (2004–2012)', minYear: 2004, maxYear: 2012, modelLine: '3 Series' },
    { code: 'F30', label: '3 Series F30/F31 (2012–2019)', minYear: 2012, maxYear: 2019, modelLine: '3 Series' },
    { code: 'G20', label: '3 Series G20/G21 (2019–)',    minYear: 2019, maxYear: 2026, modelLine: '3 Series' },
    // 5 Series
    { code: 'E39', label: '5 Series E39 (1995–2003)', minYear: 1995, maxYear: 2003, modelLine: '5 Series' },
    { code: 'E60', label: '5 Series E60/E61 (2003–2010)', minYear: 2003, maxYear: 2010, modelLine: '5 Series' },
    { code: 'F10', label: '5 Series F10/F11 (2010–2017)', minYear: 2010, maxYear: 2017, modelLine: '5 Series' },
    { code: 'G30', label: '5 Series G30/G31 (2016–)',    minYear: 2016, maxYear: 2026, modelLine: '5 Series' },
    // X3 / X5
    { code: 'E53',  label: 'X5 E53 (1999–2006)',  minYear: 1999, maxYear: 2006, modelLine: 'X5' },
    { code: 'E70',  label: 'X5 E70 (2006–2013)',  minYear: 2006, maxYear: 2013, modelLine: 'X5' },
    { code: 'F15',  label: 'X5 F15 (2013–2018)',  minYear: 2013, maxYear: 2018, modelLine: 'X5' },
    { code: 'G05',  label: 'X5 G05 (2018–)',      minYear: 2018, maxYear: 2026, modelLine: 'X5' },
    { code: 'E83',  label: 'X3 E83 (2003–2010)',  minYear: 2003, maxYear: 2010, modelLine: 'X3' },
    { code: 'F25',  label: 'X3 F25 (2010–2017)',  minYear: 2010, maxYear: 2017, modelLine: 'X3' },
    { code: 'G01',  label: 'X3 G01 (2017–)',      minYear: 2017, maxYear: 2026, modelLine: 'X3' },
  ],

  'Mercedes-Benz': [
    // C-Class
    { code: 'W202', label: 'C-Class W202 (1993–2001)', minYear: 1993, maxYear: 2001, modelLine: 'C-Class' },
    { code: 'W203', label: 'C-Class W203 (2000–2007)', minYear: 2000, maxYear: 2007, modelLine: 'C-Class' },
    { code: 'W204', label: 'C-Class W204 (2007–2014)', minYear: 2007, maxYear: 2014, modelLine: 'C-Class' },
    { code: 'W205', label: 'C-Class W205 (2014–2021)', minYear: 2014, maxYear: 2021, modelLine: 'C-Class' },
    { code: 'W206', label: 'C-Class W206 (2021–)',    minYear: 2021, maxYear: 2026, modelLine: 'C-Class' },
    // E-Class
    { code: 'W210', label: 'E-Class W210 (1995–2002)', minYear: 1995, maxYear: 2002, modelLine: 'E-Class' },
    { code: 'W211', label: 'E-Class W211 (2002–2009)', minYear: 2002, maxYear: 2009, modelLine: 'E-Class' },
    { code: 'W212', label: 'E-Class W212 (2009–2016)', minYear: 2009, maxYear: 2016, modelLine: 'E-Class' },
    { code: 'W213', label: 'E-Class W213 (2016–)',    minYear: 2016, maxYear: 2026, modelLine: 'E-Class' },
    // S-Class
    { code: 'W220', label: 'S-Class W220 (1998–2005)', minYear: 1998, maxYear: 2005, modelLine: 'S-Class' },
    { code: 'W221', label: 'S-Class W221 (2005–2013)', minYear: 2005, maxYear: 2013, modelLine: 'S-Class' },
    { code: 'W222', label: 'S-Class W222 (2013–2020)', minYear: 2013, maxYear: 2020, modelLine: 'S-Class' },
    { code: 'W223', label: 'S-Class W223 (2020–)',    minYear: 2020, maxYear: 2026, modelLine: 'S-Class' },
    // GLE/ML
    { code: 'W163', label: 'ML W163 (1997–2005)',  minYear: 1997, maxYear: 2005, modelLine: 'M-Class' },
    { code: 'W164', label: 'ML W164 (2005–2011)',  minYear: 2005, maxYear: 2011, modelLine: 'M-Class' },
    { code: 'W166', label: 'GLE W166 (2011–2018)', minYear: 2011, maxYear: 2018, modelLine: 'GLE-Class' },
    { code: 'W167', label: 'GLE W167 (2018–)',     minYear: 2018, maxYear: 2026, modelLine: 'GLE-Class' },
  ],

  'Audi': [
    // A3
    { code: '8L', label: 'A3 8L (1996–2003)', minYear: 1996, maxYear: 2003, modelLine: 'A3' },
    { code: '8P', label: 'A3 8P (2003–2013)', minYear: 2003, maxYear: 2013, modelLine: 'A3' },
    { code: '8V', label: 'A3 8V (2012–2020)', minYear: 2012, maxYear: 2020, modelLine: 'A3' },
    { code: '8Y', label: 'A3 8Y (2020–)',    minYear: 2020, maxYear: 2026, modelLine: 'A3' },
    // A4
    { code: 'B5', label: 'A4 B5 (1994–2001)', minYear: 1994, maxYear: 2001, modelLine: 'A4' },
    { code: 'B6', label: 'A4 B6 (2000–2006)', minYear: 2000, maxYear: 2006, modelLine: 'A4' },
    { code: 'B7', label: 'A4 B7 (2004–2008)', minYear: 2004, maxYear: 2008, modelLine: 'A4' },
    { code: 'B8', label: 'A4 B8 (2007–2015)', minYear: 2007, maxYear: 2015, modelLine: 'A4' },
    { code: 'B9', label: 'A4 B9 (2015–)',    minYear: 2015, maxYear: 2026, modelLine: 'A4' },
    // A6
    { code: 'C5', label: 'A6 C5 (1997–2004)', minYear: 1997, maxYear: 2004, modelLine: 'A6' },
    { code: 'C6', label: 'A6 C6 (2004–2011)', minYear: 2004, maxYear: 2011, modelLine: 'A6' },
    { code: 'C7', label: 'A6 C7 (2011–2018)', minYear: 2011, maxYear: 2018, modelLine: 'A6' },
    { code: 'C8', label: 'A6 C8 (2018–)',    minYear: 2018, maxYear: 2026, modelLine: 'A6' },
    // Q5 / Q7
    { code: 'Q5 8R',  label: 'Q5 8R (2008–2017)',  minYear: 2008, maxYear: 2017, modelLine: 'Q5' },
    { code: 'Q5 FY',  label: 'Q5 FY (2016–)',       minYear: 2016, maxYear: 2026, modelLine: 'Q5' },
    { code: 'Q7 4L',  label: 'Q7 4L (2005–2015)',   minYear: 2005, maxYear: 2015, modelLine: 'Q7' },
    { code: 'Q7 4M',  label: 'Q7 4M (2015–)',       minYear: 2015, maxYear: 2026, modelLine: 'Q7' },
  ],

  'Volkswagen': [
    // Golf
    { code: 'Mk4', label: 'Golf Mk4 (1997–2006)', minYear: 1997, maxYear: 2006, modelLine: 'Golf' },
    { code: 'Mk5', label: 'Golf Mk5 (2003–2009)', minYear: 2003, maxYear: 2009, modelLine: 'Golf' },
    { code: 'Mk6', label: 'Golf Mk6 (2008–2014)', minYear: 2008, maxYear: 2014, modelLine: 'Golf' },
    { code: 'Mk7', label: 'Golf Mk7 (2012–2020)', minYear: 2012, maxYear: 2020, modelLine: 'Golf' },
    { code: 'Mk8', label: 'Golf Mk8 (2019–)',    minYear: 2019, maxYear: 2026, modelLine: 'Golf' },
    // Passat
    { code: 'B5',  label: 'Passat B5 (1996–2005)', minYear: 1996, maxYear: 2005, modelLine: 'Passat' },
    { code: 'B6',  label: 'Passat B6 (2005–2010)', minYear: 2005, maxYear: 2010, modelLine: 'Passat' },
    { code: 'B7',  label: 'Passat B7 (2010–2014)', minYear: 2010, maxYear: 2014, modelLine: 'Passat' },
    { code: 'B8',  label: 'Passat B8 (2014–)',    minYear: 2014, maxYear: 2026, modelLine: 'Passat' },
    // Tiguan / Touareg
    { code: 'Tiguan Mk1', label: 'Tiguan Mk1 (2007–2016)', minYear: 2007, maxYear: 2016, modelLine: 'Tiguan' },
    { code: 'Tiguan Mk2', label: 'Tiguan Mk2 (2016–)',    minYear: 2016, maxYear: 2026, modelLine: 'Tiguan' },
  ],

  'Toyota': [
    { code: 'E120', label: 'Corolla E120 (2001–2007)', minYear: 2001, maxYear: 2007, modelLine: 'Corolla' },
    { code: 'E150', label: 'Corolla E150 (2006–2013)', minYear: 2006, maxYear: 2013, modelLine: 'Corolla' },
    { code: 'E160', label: 'Corolla E160 (2012–2018)', minYear: 2012, maxYear: 2018, modelLine: 'Corolla' },
    { code: 'E210', label: 'Corolla E210 (2018–)',    minYear: 2018, maxYear: 2026, modelLine: 'Corolla' },
    { code: 'XW40', label: 'RAV4 XW40 (2012–2018)',  minYear: 2012, maxYear: 2018, modelLine: 'RAV4' },
    { code: 'XW50', label: 'RAV4 XW50 (2018–)',      minYear: 2018, maxYear: 2026, modelLine: 'RAV4' },
    { code: 'W50 Camry', label: 'Camry XV50 (2011–2017)', minYear: 2011, maxYear: 2017, modelLine: 'Camry' },
    { code: 'W70 Camry', label: 'Camry XV70 (2017–)',    minYear: 2017, maxYear: 2026, modelLine: 'Camry' },
  ],

  'Ford': [
    { code: 'Focus Mk2', label: 'Focus Mk2 (2004–2011)', minYear: 2004, maxYear: 2011, modelLine: 'Focus' },
    { code: 'Focus Mk3', label: 'Focus Mk3 (2010–2018)', minYear: 2010, maxYear: 2018, modelLine: 'Focus' },
    { code: 'Focus Mk4', label: 'Focus Mk4 (2018–)',    minYear: 2018, maxYear: 2026, modelLine: 'Focus' },
    { code: 'Mondeo Mk4', label: 'Mondeo Mk4 (2007–2014)', minYear: 2007, maxYear: 2014, modelLine: 'Mondeo' },
    { code: 'Mondeo Mk5', label: 'Mondeo Mk5 (2014–)',   minYear: 2014, maxYear: 2026, modelLine: 'Mondeo' },
    { code: 'Kuga Mk1', label: 'Kuga Mk1 (2008–2012)', minYear: 2008, maxYear: 2012, modelLine: 'Kuga' },
    { code: 'Kuga Mk2', label: 'Kuga Mk2 (2012–2019)', minYear: 2012, maxYear: 2019, modelLine: 'Kuga' },
    { code: 'Kuga Mk3', label: 'Kuga Mk3 (2019–)',    minYear: 2019, maxYear: 2026, modelLine: 'Kuga' },
  ],

  'Opel': [
    { code: 'Astra H', label: 'Astra H (2004–2014)', minYear: 2004, maxYear: 2014, modelLine: 'Astra' },
    { code: 'Astra J', label: 'Astra J (2009–2015)', minYear: 2009, maxYear: 2015, modelLine: 'Astra' },
    { code: 'Astra K', label: 'Astra K (2015–2022)', minYear: 2015, maxYear: 2022, modelLine: 'Astra' },
    { code: 'Astra L', label: 'Astra L (2022–)',    minYear: 2022, maxYear: 2026, modelLine: 'Astra' },
    { code: 'Insignia A', label: 'Insignia A (2008–2017)', minYear: 2008, maxYear: 2017, modelLine: 'Insignia' },
    { code: 'Insignia B', label: 'Insignia B (2017–)',    minYear: 2017, maxYear: 2026, modelLine: 'Insignia' },
    { code: 'Zafira B', label: 'Zafira B (2005–2014)', minYear: 2005, maxYear: 2014, modelLine: 'Zafira' },
    { code: 'Zafira C', label: 'Zafira C (2011–)',   minYear: 2011, maxYear: 2026, modelLine: 'Zafira' },
  ],

  'Skoda': [
    { code: 'Octavia 1', label: 'Octavia 1 (1996–2010)', minYear: 1996, maxYear: 2010, modelLine: 'Octavia' },
    { code: 'Octavia 2', label: 'Octavia 2 (2004–2013)', minYear: 2004, maxYear: 2013, modelLine: 'Octavia' },
    { code: 'Octavia 3', label: 'Octavia 3 (2012–2020)', minYear: 2012, maxYear: 2020, modelLine: 'Octavia' },
    { code: 'Octavia 4', label: 'Octavia 4 (2019–)',    minYear: 2019, maxYear: 2026, modelLine: 'Octavia' },
    { code: 'Superb 2', label: 'Superb 2 (2008–2015)', minYear: 2008, maxYear: 2015, modelLine: 'Superb' },
    { code: 'Superb 3', label: 'Superb 3 (2015–)',    minYear: 2015, maxYear: 2026, modelLine: 'Superb' },
    { code: 'Kodiaq 1', label: 'Kodiaq 1 (2016–)',   minYear: 2016, maxYear: 2026, modelLine: 'Kodiaq' },
  ],
};
