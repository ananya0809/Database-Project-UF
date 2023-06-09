require('dotenv').config()

var express = require('express');
var app = express();
const fs = require('fs');


const oracledb = require("oracledb");
const user = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PW;
let covidStatusCheck = false;

async function fetchDataFromQuery(query) {
    console.log("fetching connection")
  try {
    let connection = await oracledb.getConnection(
      {
        user: user,
        password: password,
        connectionString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = oracle.cise.ufl.edu)(PORT = 1521))(CONNECT_DATA=(SID=ORCL)))"
      }
    )
    const data = await connection.execute(query)
    return data
  }

  catch(err){
    console.log(err)
  }
  console.log("Hello!")    
}

var count = `SELECT COUNT(CRM_CD) FROM WGREGORY.LA_CRIMES`

async function parseDataFromQuery(query) {
    const output = await fetchDataFromQuery(query);
    let rowCount = output['rows'].length;
    let data = [];

    for (let entry = 0; entry < rowCount; entry++) {
        let X = [];
        let Y = [];
        let Name = [];
        let rows = output['rows'][entry];
        for (let i = 0; i < output['metaData'].length; i = i + 3) {
            Y.push(rows[i + 1]);
            X.push(rows[i + 2]);
            Name.push(rows[i + 0]);
        }
        data.push([X, Y, Name]);
    }

    console.log("rowct: " + rowCount);
    console.log("data: " + data);
    
    return {
        "Data_Count": rowCount,
        "Data": data
    };
}

async function parseDataFromQuery5(query) {
    const output = await fetchDataFromQuery(query);
    let rowCount = output['rows'].length;
    
    let data = [];

    for (let entry = 0; entry < rowCount; entry++) {
        let X = [];
        let Y1 = [];
        let Y2 = [];
        let rows = output['rows'][entry];
        for (let i = 0; i < output['metaData'].length; i = i + 3) {
            console.log("Data: " + rows[i] + " : " + rows[i+1] + " : " + rows[i+2]);
            Y1.push(rows[i]);
            Y2.push(rows[i + 1]);
            X.push(rows[i + 2]);
        }
        data.push([X, Y1, Y2]);
    }

    console.log("rowct: " + rowCount);
    console.log("data: " + data);
    
    return {
        "Data_Count": rowCount,
        "Data": data
    };
}


function generateQuery2(district, vehicleCrimeTypes) {

    let districtTypeQuery = `AND l.AREA = d${district}.AREA`
    let  vehicleCrimeTypesQuery = "l.CRM_CD_DESC = '" + vehicleCrimeTypes.split("#").join("' OR l.CRM_CD_DESC = '") + "'";

    let query_2 = `--Query 2
    WITH VEHICLE_CRIMES AS
        (SELECT DISTINCT l.CRM_CD_DESC
        FROM WGREGORY.LA_CRIMES l
        WHERE
        ${vehicleCrimeTypesQuery}
--    l.CRM_CD_DESC = 'DRIVING WITHOUT OWNER CONSENT (DWOC)'
    --    OR l.CRM_CD_DESC = 'GRAND THEFT / AUTO REPAIR'
    --    OR l.CRM_CD_DESC = 'PETTY THEFT - AUTO REPAIR'
    --    OR l.CRM_CD_DESC = 'RECKLESS DRIVING'
    --    OR l.CRM_CD_DESC = 'SHOTS FIRED AT MOVING VEHICLE, TRAIN OR AIRCRAFT'
    --    OR l.CRM_CD_DESC = 'THEFT FROM MOTOR VEHICLE - ATTEMPT'
    --    OR l.CRM_CD_DESC = 'THEFT FROM MOTOR VEHICLE - GRAND ($950.01 AND OVER)'
    --    OR l.CRM_CD_DESC = 'THEFT FROM MOTOR VEHICLE - PETTY ($950 ' || chr(38) || ' UNDER)'
    --    OR l.CRM_CD_DESC = 'THROWING OBJECT AT MOVING VEHICLE'
    --    OR l.CRM_CD_DESC = 'TRAIN WRECKING'
    --    OR l.CRM_CD_DESC = 'VEHICLE - ATTEMPT STOLEN'
    --    OR l.CRM_CD_DESC = 'VEHICLE - MOTORIZED SCOOTERS, BICYCLES, AND WHEELCHAIRS'
    --    OR l.CRM_CD_DESC = 'VEHICLE - STOLEN'
    --    OR l.CRM_CD_DESC = 'BIKE - STOLEN'
    --    OR l.CRM_CD_DESC = 'BOAT - STOLEN'
    --    OR l.CRM_CD_DESC = 'BURGLARY FROM VEHICLE'
    --    OR l.CRM_CD_DESC = 'BURGLARY FROM VEHICLE, ATTEMPTED'
        ),
        DISTRICT_1 AS
        (SELECT DISTINCT l.AREA
        FROM WGREGORY.LA_CRIMES l
        WHERE l.AREA = 1 OR l.AREA = 2 OR l.AREA = 4 OR l.AREA = 11
        ),
        DISTRICT_2 AS
        (SELECT DISTINCT l.AREA
        FROM WGREGORY.LA_CRIMES l
        WHERE l.AREA = 3 OR l.AREA = 12 OR l.AREA = 13 OR l.AREA = 14 OR l.AREA = 18 OR l.AREA = 20
        ),
        DISTRICT_3 AS
        (SELECT DISTINCT l.AREA
        FROM WGREGORY.LA_CRIMES l
        WHERE l.AREA = 6 OR l.AREA = 7 OR l.AREA = 8 OR l.AREA = 9 OR l.AREA = 10 OR l.AREA = 16 OR l.AREA = 17 OR l.AREA = 19 OR l.AREA = 21
        ),
        DISTRICT_4 AS
        (SELECT DISTINCT l.AREA
        FROM WGREGORY.LA_CRIMES l
        WHERE l.AREA = 5
        ),
        DISTRICT_5 AS
        (SELECT DISTINCT l.AREA
        FROM WGREGORY.LA_CRIMES l
        WHERE l.AREA = 15
        )
    SELECT DISTINCT r10.VEHICLE_RELATED_CRIMES_2010, NVL(r10.PERCENTAGE_2010, 0) AS PERCENTAGE_2010, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2010')) AS YEAR_2010, r11.VEHICLE_RELATED_CRIMES_2011, NVL(r11.PERCENTAGE_2011, 0) AS PERCENTAGE_2011, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2011')) AS YEAR_2011, r12.VEHICLE_RELATED_CRIMES_2012, NVL(r12.PERCENTAGE_2012, 0) AS PERCENTAGE_2012, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2012')) AS YEAR_2012, r13.VEHICLE_RELATED_CRIMES_2013, NVL(r13.PERCENTAGE_2013, 0) AS PERCENTAGE_2013, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2013')) AS YEAR_2013, r14.VEHICLE_RELATED_CRIMES_2014, NVL(r14.PERCENTAGE_2014, 0) AS PERCENTAGE_2014, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2014')) AS YEAR_2014, r15.VEHICLE_RELATED_CRIMES_2015, NVL(r15.PERCENTAGE_2015, 0) AS PERCENTAGE_2015, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2015')) AS YEAR_2015, r16.VEHICLE_RELATED_CRIMES_2016, NVL(r16.PERCENTAGE_2016, 0) AS PERCENTAGE_2016, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2016')) AS YEAR_2016, r17.VEHICLE_RELATED_CRIMES_2017, NVL(r17.PERCENTAGE_2017, 0) AS PERCENTAGE_2017, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2017')) AS YEAR_2017, r18.VEHICLE_RELATED_CRIMES_2018, NVL(r18.PERCENTAGE_2018, 0) AS PERCENTAGE_2018, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2018')) AS YEAR_2018, r19.VEHICLE_RELATED_CRIMES_2019 AS VEHICLE_RELATED_CRIMES_2019, NVL(r19.PERCENTAGE_2019, 0) AS PERCENTAGE_2019, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2019')) AS YEAR_2019, r20.VEHICLE_RELATED_CRIMES_2020 AS VEHICLE_RELATED_CRIMES_2020, NVL(r20.PERCENTAGE_2020, 0) AS PERCENTAGE_2020, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2020')) AS YEAR_2020, r21.VEHICLE_RELATED_CRIMES_2021 AS VEHICLE_RELATED_CRIMES_2021, NVL(r21.PERCENTAGE_2021, 0) AS PERCENTAGE_2021, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2021')) AS YEAR_2021, r22.VEHICLE_RELATED_CRIMES_2022 AS VEHICLE_RELATED_CRIMES_2022, NVL(r22.PERCENTAGE_2022, 0) AS PERCENTAGE_2022, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2022')) AS YEAR_2022
    FROM WGREGORY.LA_CRIMES l,
        WGREGORY.VEHICLE_CRIMES vc
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2010, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2010
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '31-DEC-2010' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5 
            WHERE l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '31-DEC-2010' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '31-DEC-2010' AND l.DATE_RPTD IS NOT NULL
        ) r10 ON vc.CRM_CD_DESC = r10.VEHICLE_RELATED_CRIMES_2010
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2011, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2011
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2011' AND l.DATE_RPTD <= '31-DEC-2011' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5 
            WHERE l.DATE_RPTD >= '01-JAN-2011' AND l.DATE_RPTD <= '31-DEC-2011' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2011' AND l.DATE_RPTD <= '31-DEC-2011' AND l.DATE_RPTD IS NOT NULL
        ) r11 ON vc.CRM_CD_DESC = r11.VEHICLE_RELATED_CRIMES_2011
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2012, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2012
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2012' AND l.DATE_RPTD <= '31-DEC-2012' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5 
            WHERE l.DATE_RPTD >= '01-JAN-2012' AND l.DATE_RPTD <= '31-DEC-2012' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2012' AND l.DATE_RPTD <= '31-DEC-2012' AND l.DATE_RPTD IS NOT NULL
        ) r12 ON vc.CRM_CD_DESC = r12.VEHICLE_RELATED_CRIMES_2012
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2013, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2013
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2013' AND l.DATE_RPTD <= '31-DEC-2013' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5 
            WHERE l.DATE_RPTD >= '01-JAN-2013' AND l.DATE_RPTD <= '31-DEC-2013' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2013' AND l.DATE_RPTD <= '31-DEC-2013' AND l.DATE_RPTD IS NOT NULL
        ) r13 ON vc.CRM_CD_DESC = r13.VEHICLE_RELATED_CRIMES_2013
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2014, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2014
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2014' AND l.DATE_RPTD <= '31-DEC-2014' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5 
            WHERE l.DATE_RPTD >= '01-JAN-2014' AND l.DATE_RPTD <= '31-DEC-2014' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2014' AND l.DATE_RPTD <= '31-DEC-2014' AND l.DATE_RPTD IS NOT NULL
        ) r14 ON vc.CRM_CD_DESC = r14.VEHICLE_RELATED_CRIMES_2014
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2015, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2015
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2015' AND l.DATE_RPTD <= '31-DEC-2015' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5 
            WHERE l.DATE_RPTD >= '01-JAN-2015' AND l.DATE_RPTD <= '31-DEC-2015' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2015' AND l.DATE_RPTD <= '31-DEC-2015' AND l.DATE_RPTD IS NOT NULL
        ) r15 ON vc.CRM_CD_DESC = r15.VEHICLE_RELATED_CRIMES_2015
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2016, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2016
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2016' AND l.DATE_RPTD <= '31-DEC-2016' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5 
            WHERE l.DATE_RPTD >= '01-JAN-2016' AND l.DATE_RPTD <= '31-DEC-2016' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2016' AND l.DATE_RPTD <= '31-DEC-2016' AND l.DATE_RPTD IS NOT NULL
        ) r16 ON vc.CRM_CD_DESC = r16.VEHICLE_RELATED_CRIMES_2016
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2017, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2017
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2017' AND l.DATE_RPTD <= '31-DEC-2017' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5 
            WHERE l.DATE_RPTD >= '01-JAN-2017' AND l.DATE_RPTD <= '31-DEC-2017' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2017' AND l.DATE_RPTD <= '31-DEC-2017' AND l.DATE_RPTD IS NOT NULL
        ) r17 ON vc.CRM_CD_DESC = r17.VEHICLE_RELATED_CRIMES_2017
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2018, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2018
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2018' AND l.DATE_RPTD <= '31-DEC-2018' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
            WHERE l.DATE_RPTD >= '01-JAN-2018' AND l.DATE_RPTD <= '31-DEC-2018' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2018' AND l.DATE_RPTD <= '31-DEC-2018' AND l.DATE_RPTD IS NOT NULL
        ) r18 ON vc.CRM_CD_DESC = r18.VEHICLE_RELATED_CRIMES_2018
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2019, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2019
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2019' AND l.DATE_RPTD <= '31-DEC-2019' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
            WHERE l.DATE_RPTD >= '01-JAN-2019' AND l.DATE_RPTD <= '31-DEC-2019' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2019' AND l.DATE_RPTD <= '31-DEC-2019' AND l.DATE_RPTD IS NOT NULL
        ) r19 ON vc.CRM_CD_DESC = r19.VEHICLE_RELATED_CRIMES_2019
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2020, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2020
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2020' AND l.DATE_RPTD <= '31-DEC-2020' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
            WHERE l.DATE_RPTD >= '01-JAN-2020' AND l.DATE_RPTD <= '31-DEC-2020' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2020' AND l.DATE_RPTD <= '31-DEC-2020' AND l.DATE_RPTD IS NOT NULL
        ) r20 ON vc.CRM_CD_DESC = r20.VEHICLE_RELATED_CRIMES_2020
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2021, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2021
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2021' AND l.DATE_RPTD <= '31-DEC-2021' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
            WHERE l.DATE_RPTD >= '01-JAN-2021' AND l.DATE_RPTD <= '31-DEC-2021' AND l.DATE_RPTD IS NOT NULL
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2021' AND l.DATE_RPTD <= '31-DEC-2021' AND l.DATE_RPTD IS NOT NULL
        ) r21 ON vc.CRM_CD_DESC = r21.VEHICLE_RELATED_CRIMES_2021
        LEFT JOIN
        (SELECT DISTINCT c.CRIME AS VEHICLE_RELATED_CRIMES_2022, ((c.OCCURRENCE / s.SUMMATION) * 100) AS PERCENTAGE_2022
        FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
                WHERE l.DATE_RPTD >= '01-JAN-2022' AND l.DATE_RPTD <= '31-DEC-2022' AND l.DATE_RPTD IS NOT NULL
                --District selection from filter would go here as one of these:
                 ${districtTypeQuery}
    --            AND l.AREA = d1.AREA
                --AND l.AREA = d2.AREA
                --AND l.AREA = d3.AREA
                --AND l.AREA = d4.AREA
                --AND l.AREA = d5.AREA
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l, WGREGORY.VEHICLE_CRIMES vc, WGREGORY.DISTRICT_1 d1, WGREGORY.DISTRICT_2 d2, WGREGORY.DISTRICT_3 d3, WGREGORY.DISTRICT_4 d4, WGREGORY.DISTRICT_5 d5
            WHERE l.DATE_RPTD >= '01-JAN-2022' AND l.DATE_RPTD <= '31-DEC-2022' AND l.DATE_RPTD IS NOT NULL
            --District selection from filter would go here as one of these:
             ${districtTypeQuery}
    --        AND l.AREA = d1.AREA
            --AND l.AREA = d2.AREA
            --AND l.AREA = d3.AREA
            --AND l.AREA = d4.AREA
            --AND l.AREA = d5.AREA
            AND l.CRM_CD_DESC = vc.CRM_CD_DESC
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = l.CRM_CD_DESC AND l.DATE_RPTD >= '01-JAN-2022' AND l.DATE_RPTD <= '31-DEC-2022' AND l.DATE_RPTD IS NOT NULL
        ) r22 ON vc.CRM_CD_DESC = r22.VEHICLE_RELATED_CRIMES_2022  `

        fs.writeFile('test.txt', query_2, err => {
            if (err) {
              console.error(err);
            }
            // file written successfully
          });
    return query_2
}

function generateQuery3(sex, descent, ageStart, ageEnd) {

    let sexQuery = `AND l.VICT_SEX = '${sex}'`
    let descentQuery = `AND l.VICT_DESCENT = '${descent}'`
    let ageQuery = `AND l.VICT_AGE >= ${ageStart} AND l.VICT_AGE <= ${ageEnd}`

    let query_3 = `--Query 3
    WITH CRIME_COUNT AS
        (SELECT DISTINCT r.MOST_COMMON_CRIME, r.RATIO_RANGE
        FROM WGREGORY.LA_CRIMES l,
            (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIME, MAX(c.OCCURRENCE / s.SUMMATION) AS RATIO_RANGE
            FROM WGREGORY.LA_CRIMES l,
                (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
                FROM 
                    (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                    FROM WGREGORY.LA_CRIMES l
                    WHERE l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '31-DEC-2022' AND l.DATE_RPTD IS NOT NULL
                    GROUP BY l.CRM_CD_DESC
                    ) c
                ) s,
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '31-DEC-2022' AND l.DATE_RPTD IS NOT NULL
                --Filter for Sex here
                ${sexQuery}
    --            AND l.VICT_SEX = 'M'
                --AND l.VICT_SEX = 'F'
                --AND l.VICT_SEX = 'X'
                
                --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
                ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
    --            AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
                GROUP BY l.CRM_CD_DESC
                ) c
            WHERE l.CRM_CD_DESC = c.CRIME AND l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '31-DEC-2022' AND l.DATE_RPTD IS NOT NULL
            GROUP BY c.CRIME
            ORDER BY RATIO_RANGE DESC
            FETCH FIRST 5 ROWS ONLY
            ) r
        WHERE l.CRM_CD_DESC = r.MOST_COMMON_CRIME
        )
    SELECT DISTINCT r10.MOST_COMMON_CRIMES_2010, NVL(r10.RATIO_2010, 0) AS RATIO_2010, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2010')) AS YEAR_2010, r11.MOST_COMMON_CRIMES_2011, NVL(r11.RATIO_2011, 0) AS RATIO_2011, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2011')) AS YEAR_2011, r12.MOST_COMMON_CRIMES_2012, NVL(r12.RATIO_2012, 0) AS RATIO_2012, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2012')) AS YEAR_2012,  r13.MOST_COMMON_CRIMES_2013, NVL(r13.RATIO_2013, 0) AS RATIO_2013, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2013')) AS YEAR_2013, r14.MOST_COMMON_CRIMES_2014, NVL(r14.RATIO_2014, 0) AS RATIO_2014, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2014')) AS YEAR_2014, r15.MOST_COMMON_CRIMES_2015, NVL(r15.RATIO_2015, 0) AS RATIO_2015, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2015')) AS YEAR_2015, r16.MOST_COMMON_CRIMES_2016, NVL(r16.RATIO_2016, 0) AS RATIO_2016, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2016')) AS YEAR_2016, r17.MOST_COMMON_CRIMES_2017, NVL(r17.RATIO_2017, 0) AS RATIO_2017, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2017')) AS YEAR_2017, r18.MOST_COMMON_CRIMES_2018, NVL(r18.RATIO_2018, 0) AS RATIO_2018, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2018')) AS YEAR_2018, r19.MOST_COMMON_CRIMES_2019, NVL(r19.RATIO_2019, 0) AS RATIO_2019, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2019')) AS YEAR_2019, r20.MOST_COMMON_CRIMES_2020, NVL(r20.RATIO_2020, 0) AS RATIO_2020, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2020')) AS YEAR_2020, r21.MOST_COMMON_CRIMES_2021, NVL(r21.RATIO_2021, 0) AS RATIO_2021, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2021')) AS YEAR_2021, r22.MOST_COMMON_CRIMES_2022, NVL(r22.RATIO_2022, 0) AS RATIO_2022, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2022')) AS YEAR_2022
    FROM WGREGORY.CRIME_COUNT cc FULL JOIN WGREGORY.LA_CRIMES l ON l.CRM_CD_DESC = cc.MOST_COMMON_CRIME
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2010, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2010
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '31-DEC-2010' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '31-DEC-2010' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
            
            --Filter for Age. (I assume the slider will be used to shift the numbers used here)
            ${ageQuery}
    --        AND l.VICT_AGE >= 18
            --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '31-DEC-2010' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2010 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r10 ON l.CRM_CD_DESC = r10.MOST_COMMON_CRIMES_2010
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2011, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2011
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2011' AND l.DATE_RPTD <= '31-DEC-2011' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2011' AND l.DATE_RPTD <= '31-DEC-2011' AND l.DATE_RPTD IS NOT NULL 
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2011' AND l.DATE_RPTD <= '31-DEC-2011' AND l.DATE_RPTD IS NOT NULL
        AND l.VICT_SEX = 'M'
        ORDER BY RATIO_2011 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r11 ON l.CRM_CD_DESC = r11.MOST_COMMON_CRIMES_2011
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2012, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2012
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2012' AND l.DATE_RPTD <= '31-DEC-2012' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2012' AND l.DATE_RPTD <= '31-DEC-2012' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2012' AND l.DATE_RPTD <= '31-DEC-2012' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2012 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r12 ON l.CRM_CD_DESC = r12.MOST_COMMON_CRIMES_2012
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2013, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2013
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2013' AND l.DATE_RPTD <= '31-DEC-2013' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2013' AND l.DATE_RPTD <= '31-DEC-2013' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2013' AND l.DATE_RPTD <= '31-DEC-2013' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2013 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r13 ON l.CRM_CD_DESC = r13.MOST_COMMON_CRIMES_2013
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2014, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2014
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2014' AND l.DATE_RPTD <= '31-DEC-2014' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2014' AND l.DATE_RPTD <= '31-DEC-2014' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2014' AND l.DATE_RPTD <= '31-DEC-2014' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2014 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r14 ON l.CRM_CD_DESC = r14.MOST_COMMON_CRIMES_2014
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2015, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2015
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2015' AND l.DATE_RPTD <= '31-DEC-2015' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2015' AND l.DATE_RPTD <= '31-DEC-2015' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2015' AND l.DATE_RPTD <= '31-DEC-2015' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2015 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r15 ON l.CRM_CD_DESC = r15.MOST_COMMON_CRIMES_2015
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2016, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2016
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2016' AND l.DATE_RPTD <= '31-DEC-2016' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2016' AND l.DATE_RPTD <= '31-DEC-2016' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2016' AND l.DATE_RPTD <= '31-DEC-2016' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2016 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r16 ON l.CRM_CD_DESC = r16.MOST_COMMON_CRIMES_2016
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2017, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2017
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2017' AND l.DATE_RPTD <= '31-DEC-2017' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2017' AND l.DATE_RPTD <= '31-DEC-2017' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2017' AND l.DATE_RPTD <= '31-DEC-2017' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2017 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r17 ON l.CRM_CD_DESC = r17.MOST_COMMON_CRIMES_2017
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2018, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2018
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2018' AND l.DATE_RPTD <= '31-DEC-2018' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2018' AND l.DATE_RPTD <= '31-DEC-2018' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2018' AND l.DATE_RPTD <= '31-DEC-2018' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2018 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r18 ON l.CRM_CD_DESC = r18.MOST_COMMON_CRIMES_2018
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2019, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2019
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2019' AND l.DATE_RPTD <= '31-DEC-2019' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2019' AND l.DATE_RPTD <= '31-DEC-2019' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2019' AND l.DATE_RPTD <= '31-DEC-2019' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2019 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r19 ON l.CRM_CD_DESC = r19.MOST_COMMON_CRIMES_2019
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2020, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2020
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2020' AND l.DATE_RPTD <= '31-DEC-2020' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2020' AND l.DATE_RPTD <= '31-DEC-2020' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2020' AND l.DATE_RPTD <= '31-DEC-2020' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2020 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r20 ON l.CRM_CD_DESC = r20.MOST_COMMON_CRIMES_2020
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2021, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2021
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2021' AND l.DATE_RPTD <= '31-DEC-2021' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2021' AND l.DATE_RPTD <= '31-DEC-2021' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2021' AND l.DATE_RPTD <= '31-DEC-2021' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2021 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r21 ON l.CRM_CD_DESC = r21.MOST_COMMON_CRIMES_2021
    FULL JOIN
        (SELECT DISTINCT c.CRIME AS MOST_COMMON_CRIMES_2022, (c.OCCURRENCE / s.SUMMATION) AS RATIO_2022
        FROM WGREGORY.LA_CRIMES l, WGREGORY.CRIME_COUNT cc,
            (SELECT DISTINCT SUM(c.OCCURRENCE) AS SUMMATION
            FROM 
                (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
                FROM WGREGORY.LA_CRIMES l
                WHERE l.DATE_RPTD >= '01-JAN-2022' AND l.DATE_RPTD <= '31-DEC-2022' AND l.DATE_RPTD IS NOT NULL
                GROUP BY l.CRM_CD_DESC
                ) c
            ) s,
            (SELECT DISTINCT l.CRM_CD_DESC AS CRIME, COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l
            WHERE l.DATE_RPTD >= '01-JAN-2022' AND l.DATE_RPTD <= '31-DEC-2022' AND l.DATE_RPTD IS NOT NULL
            --Filter for Sex here
            ${sexQuery}
    --        AND l.VICT_SEX = 'M'
            --AND l.VICT_SEX = 'F'
            --AND l.VICT_SEX = 'X'
            
            --Filter for Descent here (Place ( after AND, then OR l.VICT_DESCENT = '' after AND ( l.VICT_DESCENT = '' to account for combinations Then end line with ).
            ${descentQuery}
                --AND l.VICT_DESCENT = 'X'
    --            AND l.VICT_DESCENT = 'B'
                --AND l.VICT_DESCENT = 'F'
                --AND l.VICT_DESCENT = 'V'
                --AND l.VICT_DESCENT = 'O'
                --AND l.VICT_DESCENT = 'K'
                --AND l.VICT_DESCENT = 'H'
    --            AND l.VICT_DESCENT = 'W'
                --AND l.VICT_DESCENT = 'C'
                --AND l.VICT_DESCENT = 'U'
                --AND l.VICT_DESCENT = 'I'
                --AND l.VICT_DESCENT = 'A'
                --AND l.VICT_DESCENT = 'P'
                --AND l.VICT_DESCENT = 'J'
                --AND l.VICT_DESCENT = 'Z'
                --AND l.VICT_DESCENT = 'D'
                --AND l.VICT_DESCENT = 'G'
                --AND l.VICT_DESCENT = 'L'
                --AND l.VICT_DESCENT = 'S'
                
                --Filter for Age. (I assume the slider will be used to shift the numbers used here)
                ${ageQuery}
    --            AND l.VICT_AGE >= 18
                --AND l.VICT_AGE <= 99
            GROUP BY l.CRM_CD_DESC
            ) c
        WHERE c.CRIME = cc.MOST_COMMON_CRIME AND l.DATE_RPTD >= '01-JAN-2022' AND l.DATE_RPTD <= '31-DEC-2022' AND l.DATE_RPTD IS NOT NULL
        ORDER BY RATIO_2022 DESC
        FETCH FIRST 5 ROWS ONLY
        ) r22 ON l.CRM_CD_DESC = r22.MOST_COMMON_CRIMES_2022
    WHERE r10.MOST_COMMON_CRIMES_2010 IS NOT NULL AND r11.MOST_COMMON_CRIMES_2011 IS NOT NULL AND r12.MOST_COMMON_CRIMES_2012 IS NOT NULL AND r13.MOST_COMMON_CRIMES_2013 IS NOT NULL AND r14.MOST_COMMON_CRIMES_2014 IS NOT NULL AND r15.MOST_COMMON_CRIMES_2015 IS NOT NULL AND r16.MOST_COMMON_CRIMES_2016 IS NOT NULL AND r17.MOST_COMMON_CRIMES_2017 IS NOT NULL AND r18.MOST_COMMON_CRIMES_2018 IS NOT NULL AND r19.MOST_COMMON_CRIMES_2019 IS NOT NULL  `
    
        fs.writeFile('test.txt', query_3, err => {
            if (err) {
            console.error(err);
            }
            // file written successfully
        });

    return query_3
}

function generateQuery1(covidStatus, season, crimeGroups) {
    let seasonCovidTypeQuery;
    let seasonCrimeTypeQuery; 
    let crimeGroupsQuery = "cg.CRIME_GROUP = '" + crimeGroups.split('#').join("' OR cg.CRIME_GROUP = '") + "'";
    let covidStatusQuery;

    if(season == 1){
        seasonCovidTypeQuery = "((dates >= '01-MAR-2020' AND dates <= '31-MAY-2020') OR (dates >= '01-MAR-2021' AND dates <= '31-MAY-2021') OR (dates >= '01-MAR-2022' AND dates <= '31-MAY-2022') OR (dates >= '01-MAR-2023' AND dates <= '31-MAY-2023')) AND dates IS NOT NULL";
        seasonCrimeTypeQuery ="((l.DATE_RPTD >= '01-MAR-2010' AND l.DATE_RPTD <= '31-MAY-2010') OR (l.DATE_RPTD >= '01-MAR-2011' AND l.DATE_RPTD <= '31-MAY-2011') OR (l.DATE_RPTD >= '01-MAR-2012' AND l.DATE_RPTD <= '31-MAY-2012') OR (l.DATE_RPTD >= '01-MAR-2013' AND l.DATE_RPTD <= '31-MAY-2013') OR (l.DATE_RPTD >= '01-MAR-2014' AND l.DATE_RPTD <= '31-MAY-2014') OR (l.DATE_RPTD >= '01-MAR-2015' AND l.DATE_RPTD <= '31-MAY-2015') OR (l.DATE_RPTD >= '01-MAR-2016' AND l.DATE_RPTD <= '31-MAY-2016') OR (l.DATE_RPTD >= '01-MAR-2017' AND l.DATE_RPTD <= '31-MAY-2017') OR (l.DATE_RPTD >= '01-MAR-2018' AND l.DATE_RPTD <= '31-MAY-2018') OR (l.DATE_RPTD >= '01-MAR-2019' AND l.DATE_RPTD <= '31-MAY-2019') OR (l.DATE_RPTD >= '01-MAR-2020' AND l.DATE_RPTD <= '31-MAY-2020') OR (l.DATE_RPTD >= '01-MAR-2021' AND l.DATE_RPTD <= '31-MAY-2021') OR (l.DATE_RPTD >= '01-MAR-2022' AND l.DATE_RPTD <= '31-MAY-2022')) AND l.DATE_RPTD IS NOT NULL";
    }
    else if(season == 2){
        seasonCovidTypeQuery = "((dates >= '01-JUN-2020' AND dates <= '31-AUG-2020') OR (dates >= '01-JUN-2021' AND dates <= '31-AUG-2021') OR (dates >= '01-JUN-2022' AND dates <= '31-AUG-2022')) AND dates IS NOT NULL";
        seasonCrimeTypeQuery ="((l.DATE_RPTD >= '01-JUN-2010' AND l.DATE_RPTD <= '31-AUG-2010') OR (l.DATE_RPTD >= '01-JUN-2011' AND l.DATE_RPTD <= '31-AUG-2011') OR (l.DATE_RPTD >= '01-JUN-2012' AND l.DATE_RPTD <= '31-AUG-2012') OR (l.DATE_RPTD >= '01-JUN-2013' AND l.DATE_RPTD <= '31-AUG-2013') OR (l.DATE_RPTD >= '01-JUN-2014' AND l.DATE_RPTD <= '31-AUG-2014') OR (l.DATE_RPTD >= '01-JUN-2015' AND l.DATE_RPTD <= '31-AUG-2015') OR (l.DATE_RPTD >= '01-JUN-2016' AND l.DATE_RPTD <= '31-AUG-2016') OR (l.DATE_RPTD >= '01-JUN-2017' AND l.DATE_RPTD <= '31-AUG-2017') OR (l.DATE_RPTD >= '01-JUN-2018' AND l.DATE_RPTD <= '31-AUG-2018') OR (l.DATE_RPTD >= '01-JUN-2019' AND l.DATE_RPTD <= '31-AUG-2019') OR (l.DATE_RPTD >= '01-JUN-2020' AND l.DATE_RPTD <= '31-AUG-2020') OR (l.DATE_RPTD >= '01-JUN-2021' AND l.DATE_RPTD <= '31-AUG-2021')) AND l.DATE_RPTD IS NOT NULL";
    }
    else if (season == 3){
        seasonCovidTypeQuery = "((dates >= '01-SEP-2020' AND dates <= '30-NOV-2020') OR (dates >= '01-SEP-2021' AND dates <= '30-NOV-2021') OR (dates >= '01-SEP-2022' AND dates <= '30-NOV-2022')) AND dates IS NOT NULL";
        seasonCrimeTypeQuery ="((l.DATE_RPTD >= '01-SEP-2010' AND l.DATE_RPTD <= '30-NOV-2010') OR (l.DATE_RPTD >= '01-SEP-2011' AND l.DATE_RPTD <= '30-NOV-2011') OR (l.DATE_RPTD >= '01-SEP-2012' AND l.DATE_RPTD <= '30-NOV-2012') OR (l.DATE_RPTD >= '01-SEP-2013' AND l.DATE_RPTD <= '30-NOV-2013') OR (l.DATE_RPTD >= '01-SEP-2014' AND l.DATE_RPTD <= '30-NOV-2014') OR (l.DATE_RPTD >= '01-SEP-2015' AND l.DATE_RPTD <= '30-NOV-2015') OR (l.DATE_RPTD >= '01-SEP-2016' AND l.DATE_RPTD <= '30-NOV-2016') OR (l.DATE_RPTD >= '01-SEP-2017' AND l.DATE_RPTD <= '30-NOV-2017') OR (l.DATE_RPTD >= '01-SEP-2018' AND l.DATE_RPTD <= '30-NOV-2018') OR (l.DATE_RPTD >= '01-SEP-2019' AND l.DATE_RPTD <= '30-NOV-2019') OR (l.DATE_RPTD >= '01-SEP-2020' AND l.DATE_RPTD <= '30-NOV-2020') OR (l.DATE_RPTD >= '01-SEP-2021' AND l.DATE_RPTD <= '30-NOV-2021')) AND l.DATE_RPTD IS NOT NULL";
    }
    else{
        seasonCovidTypeQuery = "((dates >= '01-JAN-2020' AND dates <= '28-FEB-2020') OR (dates >= '01-DEC-2020' AND dates <= '31-DEC-2020')) OR ((dates >= '01-JAN-2021' AND dates <= '28-FEB-2021') OR (dates >= '01-DEC-2021' AND dates <= '31-DEC-2021')) OR ((dates >= '01-JAN-2022' AND dates <= '28-FEB-2022') OR (dates >= '01-DEC-2022' AND dates <= '31-DEC-2022')) OR ((dates >= '01-JAN-2023' AND dates <= '28-FEB-2023')) AND dates IS NOT NULL";
        seasonCrimeTypeQuery ="(((l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '28-FEB-2010') OR (l.DATE_RPTD >= '01-DEC-2010' AND l.DATE_RPTD <= '31-DEC-2010')) OR ((l.DATE_RPTD >= '01-JAN-2011' AND l.DATE_RPTD <= '28-FEB-2011') OR (l.DATE_RPTD >= '01-DEC-2011' AND l.DATE_RPTD <= '31-DEC-2011')) OR ((l.DATE_RPTD >= '01-JAN-2012' AND l.DATE_RPTD <= '28-FEB-2012') OR (l.DATE_RPTD >= '01-DEC-2012' AND l.DATE_RPTD <= '31-DEC-2012')) OR ((l.DATE_RPTD >= '01-JAN-2013' AND l.DATE_RPTD <= '28-FEB-2013') OR (l.DATE_RPTD >= '01-DEC-2013' AND l.DATE_RPTD <= '31-DEC-2013')) OR ((l.DATE_RPTD >= '01-JAN-2014' AND l.DATE_RPTD <= '28-FEB-2014') OR (l.DATE_RPTD >= '01-DEC-2014' AND l.DATE_RPTD <= '31-DEC-2014')) OR ((l.DATE_RPTD >= '01-JAN-2015' AND l.DATE_RPTD <= '28-FEB-2015') OR (l.DATE_RPTD >= '01-DEC-2015' AND l.DATE_RPTD <= '31-DEC-2015')) OR ((l.DATE_RPTD >= '01-JAN-2016' AND l.DATE_RPTD <= '28-FEB-2016') OR (l.DATE_RPTD >= '01-DEC-2016' AND l.DATE_RPTD <= '31-DEC-2016')) OR ((l.DATE_RPTD >= '01-JAN-2017' AND l.DATE_RPTD <= '28-FEB-2017') OR (l.DATE_RPTD >= '01-DEC-2017' AND l.DATE_RPTD <= '31-DEC-2017')) OR ((l.DATE_RPTD >= '01-JAN-2018' AND l.DATE_RPTD <= '28-FEB-2018') OR (l.DATE_RPTD >= '01-DEC-2018' AND l.DATE_RPTD <= '31-DEC-2018')) OR ((l.DATE_RPTD >= '01-JAN-2019' AND l.DATE_RPTD <= '28-FEB-2019') OR (l.DATE_RPTD >= '01-DEC-2019' AND l.DATE_RPTD <= '31-DEC-2019')) OR ((l.DATE_RPTD >= '01-JAN-2020' AND l.DATE_RPTD <= '28-FEB-2020') OR (l.DATE_RPTD >= '01-DEC-2020' AND l.DATE_RPTD <= '31-DEC-2020')) OR ((l.DATE_RPTD >= '01-JAN-2021' AND l.DATE_RPTD <= '28-FEB-2021') OR (l.DATE_RPTD >= '01-DEC-2021' AND l.DATE_RPTD <= '31-DEC-2021')) OR ((l.DATE_RPTD >= '01-JAN-2022' AND l.DATE_RPTD <= '28-FEB-2022'))) AND l.DATE_RPTD IS NOT NULL";
    }

    if(covidStatus == 'Yes'){
        covidStatusQuery = ", 0 AS WEEK_1_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c2.CASE, 0) - NVL(c1.CASE, 0)) * 100.0 / NVL(c1.CASE, 1)), 0) AS WEEK_2_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c3.CASE, 0) - NVL(c2.CASE, 0)) * 100.0 / NVL(c2.CASE, 1)), 0) AS WEEK_3_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c4.CASE, 0) - NVL(c3.CASE, 0)) * 100.0 / NVL(c3.CASE, 1)), 0) AS WEEK_4_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c5.CASE, 0) - NVL(c4.CASE, 0)) * 100.0 / NVL(c4.CASE, 1)), 0) AS WEEK_5_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c6.CASE, 0) - NVL(c5.CASE, 0)) * 100.0 / NVL(c5.CASE, 1)), 0) AS WEEK_6_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c7.CASE, 0) - NVL(c6.CASE, 0)) * 100.0 / NVL(c6.CASE, 1)), 0) AS WEEK_7_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c8.CASE, 0) - NVL(c7.CASE, 0)) * 100.0 / NVL(c7.CASE, 1)), 0) AS WEEK_8_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c9.CASE, 0) - NVL(c8.CASE, 0)) * 100.0 / NVL(c8.CASE, 1)), 0) AS WEEK_9_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c10.CASE, 0) - NVL(c9.CASE, 0)) * 100.0 / NVL(c9.CASE, 1)), 0) AS WEEK_10_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c11.CASE, 0) - NVL(c10.CASE, 0)) * 100.0 / NVL(c10.CASE, 1)), 0) AS WEEK_11_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c12.CASE, 0) - NVL(c11.CASE, 0)) * 100.0 / NVL(c11.CASE, 1)), 0) AS WEEK_12_COVID_PERCENTAGE_CHANGE, NVL(((NVL(c13.CASE, 0) - NVL(c12.CASE, 0)) * 100.0 / NVL(c12.CASE, 1)), 0) AS WEEK_13_COVID_PERCENTAGE_CHANGE";
        covidStatusCheck = true;
    }
    if(covidStatus == 'No'){
        covidStatusQuery = "";
    }

    let query_1 = `WITH tempCovid as 
    (SELECT DISTINCT c.DATES as dates,
           CASE WHEN SUM(NVL(c.TOTAL_ADULT_PATIENTS_HOSPITALIZED_CONFIRMED_AND_SUSPECTED_COVID, 0) + NVL(c.TOTAL_PEDIATRIC_PATIENTS_HOSPITALIZED_CONFIRMED_COVID, 0)) > 0 
           THEN SUM(NVL(c.TOTAL_ADULT_PATIENTS_HOSPITALIZED_CONFIRMED_AND_SUSPECTED_COVID, 0) + NVL(c.TOTAL_PEDIATRIC_PATIENTS_HOSPITALIZED_CONFIRMED_COVID, 0)) END case
           FROM WGREGORY.COVID c
           WHERE c.STATE = 'CA' AND ${seasonCovidTypeQuery}
           GROUP BY c.DATES) 
    SELECT DISTINCT cg.CRIME_GROUP, 
    0 AS WEEK_1_PERCENTAGE_CHANGE, 
    NVL(((NVL(w2.WEEK_2_OCCURRENCE, 0) - NVL(w1.WEEK_1_OCCURRENCE, 0)) * 100.0 / NVL(w1.WEEK_1_OCCURRENCE, 1)), 0) AS WEEK_2_PERCENTAGE_CHANGE, 
    NVL(((NVL(w3.WEEK_3_OCCURRENCE, 0) - NVL(w2.WEEK_2_OCCURRENCE, 0)) * 100.0 / NVL(w2.WEEK_2_OCCURRENCE, 1)), 0) AS WEEK_3_PERCENTAGE_CHANGE, 
    NVL(((NVL(w4.WEEK_4_OCCURRENCE, 0) - NVL(w3.WEEK_3_OCCURRENCE, 0)) * 100.0 / NVL(w3.WEEK_3_OCCURRENCE, 1)), 0) AS WEEK_4_PERCENTAGE_CHANGE, 
    NVL(((NVL(w5.WEEK_5_OCCURRENCE, 0) - NVL(w4.WEEK_4_OCCURRENCE, 0)) * 100.0 / NVL(w4.WEEK_4_OCCURRENCE, 1)), 0) AS WEEK_5_PERCENTAGE_CHANGE, 
    NVL(((NVL(w6.WEEK_6_OCCURRENCE, 0) - NVL(w5.WEEK_5_OCCURRENCE, 0)) * 100.0 / NVL(w5.WEEK_5_OCCURRENCE, 1)), 0) AS WEEK_6_PERCENTAGE_CHANGE, 
    NVL(((NVL(w7.WEEK_7_OCCURRENCE, 0) - NVL(w6.WEEK_6_OCCURRENCE, 0)) * 100.0 / NVL(w6.WEEK_6_OCCURRENCE, 1)), 0) AS WEEK_7_PERCENTAGE_CHANGE, 
    NVL(((NVL(w8.WEEK_8_OCCURRENCE, 0) - NVL(w7.WEEK_7_OCCURRENCE, 0)) * 100.0 / NVL(w7.WEEK_7_OCCURRENCE, 1)), 0) AS WEEK_8_PERCENTAGE_CHANGE, 
    NVL(((NVL(w9.WEEK_9_OCCURRENCE, 0) - NVL(w8.WEEK_8_OCCURRENCE, 0)) * 100.0 / NVL(w8.WEEK_8_OCCURRENCE, 1)), 0) AS WEEK_9_PERCENTAGE_CHANGE, 
    NVL(((NVL(w10.WEEK_10_OCCURRENCE, 0) - NVL(w9.WEEK_9_OCCURRENCE, 0)) * 100.0 / NVL(w9.WEEK_9_OCCURRENCE, 1)), 0) AS WEEK_10_PERCENTAGE_CHANGE, 
    NVL(((NVL(w11.WEEK_11_OCCURRENCE, 0) - NVL(w10.WEEK_10_OCCURRENCE, 0)) * 100.0 / NVL(w10.WEEK_10_OCCURRENCE, 1)), 0) AS WEEK_11_PERCENTAGE_CHANGE, 
    NVL(((NVL(w12.WEEK_12_OCCURRENCE, 0) - NVL(w11.WEEK_11_OCCURRENCE, 0)) * 100.0 / NVL(w11.WEEK_11_OCCURRENCE, 1)), 0) AS WEEK_12_PERCENTAGE_CHANGE, 
    NVL(((NVL(w13.WEEK_13_OCCURRENCE, 0) - NVL(w12.WEEK_12_OCCURRENCE, 0)) * 100.0 / NVL(w12.WEEK_12_OCCURRENCE, 1)), 0) AS WEEK_13_PERCENTAGE_CHANGE
    ${covidStatusQuery}
    FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC 
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_1, COUNT(l.CRM_CD_DESC) AS WEEK_1_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 1
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w1 ON w1.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_2, COUNT(l.CRM_CD_DESC) AS WEEK_2_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 2 
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w2 ON w2.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_3, COUNT(l.CRM_CD_DESC) AS WEEK_3_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 3 
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w3 ON w3.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_4, COUNT(l.CRM_CD_DESC) AS WEEK_4_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 4
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w4 ON w4.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_5, COUNT(l.CRM_CD_DESC) AS WEEK_5_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 5
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w5 ON w5.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_6, COUNT(l.CRM_CD_DESC) AS WEEK_6_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 6
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w6 ON w6.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_7, COUNT(l.CRM_CD_DESC) AS WEEK_7_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC 
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 7
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w7 ON w7.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_8, COUNT(l.CRM_CD_DESC) AS WEEK_8_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 8
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w8 ON w8.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_9, COUNT(l.CRM_CD_DESC) AS WEEK_9_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC 
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 9
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w9 ON w9.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_10, COUNT(l.CRM_CD_DESC) AS WEEK_10_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC 
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 10
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w10 ON w10.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_11, COUNT(l.CRM_CD_DESC) AS WEEK_11_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC 
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 11
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w11 ON w11.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_12, COUNT(l.CRM_CD_DESC) AS WEEK_12_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 12
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w12 ON w12.CRIME_GROUP = cg.CRIME_GROUP
           LEFT JOIN
           (SELECT DISTINCT cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1 AS WEEK_13, COUNT(l.CRM_CD_DESC) AS WEEK_13_OCCURRENCE
           FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC 
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1) = 13
           GROUP BY cg.CRIME_GROUP, MOD(TO_NUMBER(TO_CHAR(TRUNC(l.DATE_RPTD, 'WW'), 'WW')), 13) + 1
           ) w13 ON w13.CRIME_GROUP = cg.CRIME_GROUP,
           
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_1, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 1 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c1,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_2, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 2 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c2,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_3, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 3 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c3,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_4, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 4 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c4,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_5, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 5 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c5,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_6, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 6 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c6,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_7, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 7 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c7,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_8, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 8 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c8,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_9, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 9 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c9,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_10, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 10 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c10,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_11, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 11 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c11,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_12, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 12 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c12,
           (SELECT DISTINCT MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1 AS WEEK_13, AVG(case) AS CASE
           FROM tempCovid
           WHERE (MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1) = 13 
           GROUP BY MOD(TO_NUMBER(TO_CHAR(TRUNC(dates, 'WW'), 'WW')), 13) + 1
           ) c13
       WHERE cg.CRIME_GROUP IS NOT NULL AND 
        ${crimeGroupsQuery} AND ${seasonCrimeTypeQuery}`

        fs.writeFile('test1.txt', query_1, err => {
            if (err) {
              console.error(err);
            }
            // file written successfully
          });
    return query_1
}




function getPremisesFilter(val){
    if(val == 1){
        return "\'ALLEY\'";
    }
    else if(val == 2){
        return "\'DRIVEWAY\'";
    }
    else if(val == 3){
        return "\'GARAGE/CARPORT\'";
    }
    else if(val == 4){
        return "\'GAS STATION\'";
    }
    else if(val == 5){
        return "\'MOBILE HOME/TRAILERS/CONSTRUCTION TRAILERS/RV''S/MOTORHOME\'";
    }
    else if(val == 6){
        return "\'MULTI-UNIT DWELLING (APARTMENT, DUPLEX, ETC)\'";
    }
    else if(val == 7){
        return "\'OTHER BUSINESS\'";
    }
    else if(val == 8){
        return "\'OTHER PREMISE\'";
    }
    else if(val == 9){
        return "\'POST OFFICE\'";
    }
    else if(val == 10){
        return "\'SINGLE FAMILY DWELLING\'";
    }
    else if(val == 11){
        return "\'STREET\'";
    }
    else if(val == 12){
        return "\'VEHICLE, PASSENGER/TRUCK\'";
    }
    return "\'ALLEY\'";
}

function getTimeFilter(val){
    if(val == 1){
        return "6 AND EXTRACT(HOUR FROM l.TIME_OCC) < 12";
    }
    else if(val == 2){
        return "12 AND EXTRACT(HOUR FROM l.TIME_OCC) < 18";
    }
    else if(val == 3){
        return "18 AND EXTRACT(HOUR FROM l.TIME_OCC) <= 23";
    }
    else if(val == 4){
        return "0 AND EXTRACT(HOUR FROM l.TIME_OCC) < 6";
    }
    return "6 AND EXTRACT(HOUR FROM l.TIME_OCC) < 12";
}

function generateQuery4(premises, crimeGroups, time) {
    let premisesFilter = getPremisesFilter(premises);
    let crimeGroupFilter = "cg.CRIME_GROUP = '" + crimeGroups.split('#').join("' OR cg.CRIME_GROUP = '") + "'";
    let timeFilter= getTimeFilter(time);
    let query_4 = `--Query 4
    WITH TOTAL_OCCURRENCE AS
        (SELECT DISTINCT SUM(c10.OCCURRENCE) AS SUMMATION_10, SUM(c11.OCCURRENCE) AS SUMMATION_11, SUM(c12.OCCURRENCE) AS SUMMATION_12, SUM(c13.OCCURRENCE) AS SUMMATION_13, SUM(c14.OCCURRENCE) AS SUMMATION_14, SUM(c15.OCCURRENCE) AS SUMMATION_15, SUM(c16.OCCURRENCE) AS SUMMATION_16, SUM(c17.OCCURRENCE) AS SUMMATION_17, SUM(c18.OCCURRENCE) AS SUMMATION_18, SUM(c19.OCCURRENCE) AS SUMMATION_19
        FROM
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM  WGREGORY.LA_CRIMES l
            WHERE l.DATE_OCC >= '01-JAN-2010' AND l.DATE_OCC <= '31-DEC-2010' AND l.DATE_OCC IS NOT NULL
            ) c10,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM  WGREGORY.LA_CRIMES l
            WHERE l.DATE_OCC >= '01-JAN-2011' AND l.DATE_OCC <= '31-DEC-2011' AND l.DATE_OCC IS NOT NULL
            ) c11,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM  WGREGORY.LA_CRIMES l
            WHERE l.DATE_OCC >= '01-JAN-2012' AND l.DATE_OCC <= '31-DEC-2012' AND l.DATE_OCC IS NOT NULL
            ) c12,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM  WGREGORY.LA_CRIMES l
            WHERE l.DATE_OCC >= '01-JAN-2013' AND l.DATE_OCC <= '31-DEC-2013' AND l.DATE_OCC IS NOT NULL
            ) c13,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM  WGREGORY.LA_CRIMES l
            WHERE l.DATE_OCC >= '01-JAN-2014' AND l.DATE_OCC <= '31-DEC-2014' AND l.DATE_OCC IS NOT NULL
            ) c14,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM  WGREGORY.LA_CRIMES l
            WHERE l.DATE_OCC >= '01-JAN-2015' AND l.DATE_OCC <= '31-DEC-2015' AND l.DATE_OCC IS NOT NULL
            ) c15,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM  WGREGORY.LA_CRIMES l
            WHERE l.DATE_OCC >= '01-JAN-2016' AND l.DATE_OCC <= '31-DEC-2016' AND l.DATE_OCC IS NOT NULL
            ) c16,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM  WGREGORY.LA_CRIMES l
            WHERE l.DATE_OCC >= '01-JAN-2017' AND l.DATE_OCC <= '31-DEC-2017' AND l.DATE_OCC IS NOT NULL
            ) c17,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM  WGREGORY.LA_CRIMES l
            WHERE l.DATE_OCC >= '01-JAN-2018' AND l.DATE_OCC <= '31-DEC-2018' AND l.DATE_OCC IS NOT NULL
            ) c18,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM  WGREGORY.LA_CRIMES l
            WHERE l.DATE_OCC >= '01-JAN-2019' AND l.DATE_OCC <= '31-DEC-2019' AND l.DATE_OCC IS NOT NULL
            ) c19
        )
    SELECT DISTINCT r10.CRIME_GROUP AS CRIME_GROUP_2010, (r10.OCCURRENCE / t.SUMMATION_10) AS RATIO_2010, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2010')) AS YEAR_2010, r11.CRIME_GROUP AS CRIME_GROUP_2011, (r11.OCCURRENCE / t.SUMMATION_11) AS RATIO_2011, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2011')) AS YEAR_2011, r12.CRIME_GROUP AS CRIME_GROUP_2012, (r12.OCCURRENCE / t.SUMMATION_12) AS RATIO_2012, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2012')) AS YEAR_2012, r13.CRIME_GROUP AS CRIME_GROUP_2013, (r13.OCCURRENCE / t.SUMMATION_13) AS RATIO_2013, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2013')) AS YEAR_2013, r14.CRIME_GROUP AS CRIME_GROUP_2014, (r14.OCCURRENCE / t.SUMMATION_14) AS RATIO_2014, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2014')) AS YEAR_2014, r15.CRIME_GROUP AS CRIME_GROUP_2015, (r15.OCCURRENCE / t.SUMMATION_15) AS RATIO_2015, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2015')) AS YEAR_2015, r16.CRIME_GROUP AS CRIME_GROUP_2016, (r16.OCCURRENCE / t.SUMMATION_16) AS RATIO_2016, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2016')) AS YEAR_2016, r17.CRIME_GROUP AS CRIME_GROUP_2017, (r17.OCCURRENCE / t.SUMMATION_17) AS RATIO_2017, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2017')) AS YEAR_2017, r18.CRIME_GROUP AS CRIME_GROUP_2018, (r18.OCCURRENCE / t.SUMMATION_18) AS RATIO_2018, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2018')) AS YEAR_2018, r19.CRIME_GROUP AS CRIME_GROUP_2019, (r19.OCCURRENCE / t.SUMMATION_19) AS RATIO_2019, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2019')) AS YEAR_2019
    FROM TOTAL_OCCURRENCE t,  WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
    LEFT JOIN
        (SELECT DISTINCT cg.CRIME_GROUP, NVL(COUNT(l.CRM_CD_DESC), 0) AS OCCURRENCE
        FROM  WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
        WHERE l.DATE_OCC >= '01-JAN-2010' AND l.DATE_OCC <= '31-DEC-2010' AND l.DATE_OCC IS NOT NULL AND cg.CRIME_GROUP IS NOT NULL
        AND l.PREMIS_DESC = ${premisesFilter}
        AND EXTRACT(HOUR FROM l.TIME_OCC) >= ${timeFilter}
        GROUP BY CRIME_GROUP
        ) r10 ON cg.CRIME_GROUP = r10.CRIME_GROUP AND cg.CRIME_GROUP IS NOT NULL
    LEFT JOIN
        (SELECT DISTINCT cg.CRIME_GROUP, NVL(COUNT(l.CRM_CD_DESC), 0) AS OCCURRENCE
        FROM  WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
        WHERE l.DATE_OCC >= '01-JAN-2011' AND l.DATE_OCC <= '31-DEC-2011' AND l.DATE_OCC IS NOT NULL AND cg.CRIME_GROUP IS NOT NULL
        AND l.PREMIS_DESC = ${premisesFilter}
        AND EXTRACT(HOUR FROM l.TIME_OCC) >= ${timeFilter}
        GROUP BY CRIME_GROUP
        ) r11 ON cg.CRIME_GROUP = r11.CRIME_GROUP AND cg.CRIME_GROUP IS NOT NULL
    LEFT JOIN
        (SELECT DISTINCT cg.CRIME_GROUP, NVL(COUNT(l.CRM_CD_DESC), 0) AS OCCURRENCE
        FROM  WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
        WHERE l.DATE_OCC >= '01-JAN-2012' AND l.DATE_OCC <= '31-DEC-2012' AND l.DATE_OCC IS NOT NULL AND cg.CRIME_GROUP IS NOT NULL
        AND l.PREMIS_DESC = ${premisesFilter}
        AND EXTRACT(HOUR FROM l.TIME_OCC) >= ${timeFilter}
        GROUP BY CRIME_GROUP
        ) r12 ON cg.CRIME_GROUP = r12.CRIME_GROUP AND cg.CRIME_GROUP IS NOT NULL
    LEFT JOIN
        (SELECT DISTINCT cg.CRIME_GROUP, NVL(COUNT(l.CRM_CD_DESC), 0) AS OCCURRENCE
        FROM  WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
        WHERE l.DATE_OCC >= '01-JAN-2013' AND l.DATE_OCC <= '31-DEC-2013' AND l.DATE_OCC IS NOT NULL AND cg.CRIME_GROUP IS NOT NULL
        AND l.PREMIS_DESC = ${premisesFilter}
        AND EXTRACT(HOUR FROM l.TIME_OCC) >= ${timeFilter}
        GROUP BY CRIME_GROUP
        ) r13 ON cg.CRIME_GROUP = r13.CRIME_GROUP AND cg.CRIME_GROUP IS NOT NULL
    LEFT JOIN
        (SELECT DISTINCT cg.CRIME_GROUP, NVL(COUNT(l.CRM_CD_DESC), 0) AS OCCURRENCE
        FROM  WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
        WHERE l.DATE_OCC >= '01-JAN-2014' AND l.DATE_OCC <= '31-DEC-2014' AND l.DATE_OCC IS NOT NULL AND cg.CRIME_GROUP IS NOT NULL
        AND l.PREMIS_DESC = ${premisesFilter}
        AND EXTRACT(HOUR FROM l.TIME_OCC) >= ${timeFilter}
        GROUP BY CRIME_GROUP
        ) r14 ON cg.CRIME_GROUP = r14.CRIME_GROUP AND cg.CRIME_GROUP IS NOT NULL
    LEFT JOIN
        (SELECT DISTINCT cg.CRIME_GROUP, NVL(COUNT(l.CRM_CD_DESC), 0) AS OCCURRENCE
        FROM  WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
        WHERE l.DATE_OCC >= '01-JAN-2015' AND l.DATE_OCC <= '31-DEC-2015' AND l.DATE_OCC IS NOT NULL AND cg.CRIME_GROUP IS NOT NULL
        AND l.PREMIS_DESC = ${premisesFilter}
        AND EXTRACT(HOUR FROM l.TIME_OCC) >= ${timeFilter}
        GROUP BY CRIME_GROUP
        ) r15 ON cg.CRIME_GROUP = r15.CRIME_GROUP AND cg.CRIME_GROUP IS NOT NULL
    LEFT JOIN
        (SELECT DISTINCT cg.CRIME_GROUP, NVL(COUNT(l.CRM_CD_DESC), 0) AS OCCURRENCE
        FROM  WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
        WHERE l.DATE_OCC >= '01-JAN-2016' AND l.DATE_OCC <= '31-DEC-2016' AND l.DATE_OCC IS NOT NULL AND cg.CRIME_GROUP IS NOT NULL
        AND l.PREMIS_DESC = ${premisesFilter}
        AND EXTRACT(HOUR FROM l.TIME_OCC) >= ${timeFilter}
        GROUP BY CRIME_GROUP
        ) r16 ON cg.CRIME_GROUP = r16.CRIME_GROUP AND cg.CRIME_GROUP IS NOT NULL
    LEFT JOIN
        (SELECT DISTINCT cg.CRIME_GROUP, NVL(COUNT(l.CRM_CD_DESC), 0) AS OCCURRENCE
        FROM  WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
        WHERE l.DATE_OCC >= '01-JAN-2017' AND l.DATE_OCC <= '31-DEC-2017' AND l.DATE_OCC IS NOT NULL AND cg.CRIME_GROUP IS NOT NULL
        AND l.PREMIS_DESC = ${premisesFilter}
        AND EXTRACT(HOUR FROM l.TIME_OCC) >= ${timeFilter}
        GROUP BY CRIME_GROUP
        ) r17 ON cg.CRIME_GROUP = r17.CRIME_GROUP AND cg.CRIME_GROUP IS NOT NULL
    LEFT JOIN
        (SELECT DISTINCT cg.CRIME_GROUP, NVL(COUNT(l.CRM_CD_DESC), 0) AS OCCURRENCE
        FROM  WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
        WHERE l.DATE_OCC >= '01-JAN-2018' AND l.DATE_OCC <= '31-DEC-2018' AND l.DATE_OCC IS NOT NULL AND cg.CRIME_GROUP IS NOT NULL
        AND l.PREMIS_DESC = ${premisesFilter}
        AND EXTRACT(HOUR FROM l.TIME_OCC) >= ${timeFilter}
        GROUP BY CRIME_GROUP
        ) r18 ON cg.CRIME_GROUP = r18.CRIME_GROUP AND cg.CRIME_GROUP IS NOT NULL
    LEFT JOIN
        (SELECT DISTINCT cg.CRIME_GROUP, NVL(COUNT(l.CRM_CD_DESC), 0) AS OCCURRENCE
        FROM  WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
        WHERE l.DATE_OCC >= '01-JAN-2019' AND l.DATE_OCC <= '31-DEC-2019' AND l.DATE_OCC IS NOT NULL AND cg.CRIME_GROUP IS NOT NULL
        AND l.PREMIS_DESC = ${premisesFilter}
        AND EXTRACT(HOUR FROM l.TIME_OCC) >= ${timeFilter}
        GROUP BY CRIME_GROUP
        ) r19 ON cg.CRIME_GROUP = r19.CRIME_GROUP AND cg.CRIME_GROUP IS NOT NULL
    WHERE ${crimeGroupFilter}`
    return query_4
}

function generateQuery5(crimeGroups){
    let crimeGroupFilter = "cg.CRIME_GROUP = '" + crimeGroups.split('#').join("' OR cg.CRIME_GROUP = '") + "'";
    let query_5 = `--Query 5      
    SELECT DISTINCT ((w10.OCCURRENCE / (w10.OCCURRENCE + a10.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2010, ((a10.OCCURRENCE / (w10.OCCURRENCE + a10.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2010, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2010')) AS YEAR_2010, ((w11.OCCURRENCE / (w11.OCCURRENCE + a11.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2011, ((a11.OCCURRENCE / (w11.OCCURRENCE + a11.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2011, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2011')) AS YEAR_2011, ((w12.OCCURRENCE / (w12.OCCURRENCE + a12.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2012, ((a12.OCCURRENCE / (w12.OCCURRENCE + a12.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2012, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2012')) AS YEAR_2012, ((w13.OCCURRENCE / (w13.OCCURRENCE + a13.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2013, ((a13.OCCURRENCE / (w13.OCCURRENCE + a13.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2013, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2013')) AS YEAR_2013, ((w14.OCCURRENCE / (w14.OCCURRENCE + a14.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2014, ((a14.OCCURRENCE / (w14.OCCURRENCE + a14.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2014, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2014')) AS YEAR_2014, ((w15.OCCURRENCE / (w15.OCCURRENCE + a15.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2015, ((a15.OCCURRENCE / (w15.OCCURRENCE + a15.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2015, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2015')) AS YEAR_2015, ((w16.OCCURRENCE / (w16.OCCURRENCE + a16.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2016, ((a16.OCCURRENCE / (w16.OCCURRENCE + a16.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2016, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2016')) AS YEAR_2016, ((w17.OCCURRENCE / (w17.OCCURRENCE + a17.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2017, ((a17.OCCURRENCE / (w17.OCCURRENCE + a17.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2017, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2017')) AS YEAR_2017, ((w18.OCCURRENCE / (w18.OCCURRENCE + a18.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2018, ((a18.OCCURRENCE / (w18.OCCURRENCE + a18.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2018, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2018')) AS YEAR_2018, ((w19.OCCURRENCE / (w19.OCCURRENCE + a19.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2019, ((a19.OCCURRENCE / (w19.OCCURRENCE + a19.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2019, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2019')) AS YEAR_2019, ((w20.OCCURRENCE / (w20.OCCURRENCE + a20.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2020, ((a20.OCCURRENCE / (w20.OCCURRENCE + a20.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2020, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2020')) AS YEAR_2020, ((w21.OCCURRENCE / (w21.OCCURRENCE + a21.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2021, ((a21.OCCURRENCE / (w21.OCCURRENCE + a21.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2021, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2021')) AS YEAR_2021, ((w22.OCCURRENCE / (w22.OCCURRENCE + a22.OCCURRENCE)) * 100) AS PERCENTAGE_WITHIN_30_DAYS_2022, ((a22.OCCURRENCE / (w22.OCCURRENCE + a22.OCCURRENCE)) * 100) AS PERCENTAGE_AFTER_30_DAYS_2022, EXTRACT(YEAR FROM TO_DATE ('01-JAN-2022')) AS YEAR_2022
    FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '31-DEC-2010' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w10,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2010' AND l.DATE_RPTD <= '31-DEC-2010' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a10,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2011' AND l.DATE_RPTD <= '31-DEC-2011' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
           AND ${crimeGroupFilter}
            ) w11,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2011' AND l.DATE_RPTD <= '31-DEC-2011' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a11,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2012' AND l.DATE_RPTD <= '31-DEC-2012' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w12,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2012' AND l.DATE_RPTD <= '31-DEC-2012' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a12,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2013' AND l.DATE_RPTD <= '31-DEC-2013' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w13,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2013' AND l.DATE_RPTD <= '31-DEC-2013' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a13,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2014' AND l.DATE_RPTD <= '31-DEC-2014' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w14,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2014' AND l.DATE_RPTD <= '31-DEC-2014' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a14,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2015' AND l.DATE_RPTD <= '31-DEC-2015' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w15,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2015' AND l.DATE_RPTD <= '31-DEC-2015' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a15,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2016' AND l.DATE_RPTD <= '31-DEC-2016' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w16,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2016' AND l.DATE_RPTD <= '31-DEC-2016' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a16,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2017' AND l.DATE_RPTD <= '31-DEC-2017' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w17,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2017' AND l.DATE_RPTD <= '31-DEC-2017' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a17,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2018' AND l.DATE_RPTD <= '31-DEC-2018' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w18,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2018' AND l.DATE_RPTD <= '31-DEC-2018' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a18,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2019' AND l.DATE_RPTD <= '31-DEC-2019' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w19,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2019' AND l.DATE_RPTD <= '31-DEC-2019' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a19,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2020' AND l.DATE_RPTD <= '31-DEC-2020' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w20,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2020' AND l.DATE_RPTD <= '31-DEC-2020' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a20,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2021' AND l.DATE_RPTD <= '31-DEC-2021' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w21,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2021' AND l.DATE_RPTD <= '31-DEC-2021' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a21,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2022' AND l.DATE_RPTD <= '31-DEC-2022' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) <= 30
            AND ${crimeGroupFilter}
            ) w22,
            (SELECT DISTINCT COUNT(l.CRM_CD_DESC) AS OCCURRENCE
            FROM WGREGORY.LA_CRIMES l LEFT JOIN WGREGORY.CRIME_TYPE ct ON l.CRM_CD_DESC = ct.CRM_CD_DESC LEFT JOIN WGREGORY.CRIME_GROUPINGS cg ON l.CRM_CD_DESC = cg.CRM_CD_DESC
            WHERE l.DATE_RPTD >= '01-JAN-2022' AND l.DATE_RPTD <= '31-DEC-2022' AND l.DATE_RPTD IS NOT NULL
            AND (l.DATE_RPTD - l.DATE_OCC) > 30
            AND ${crimeGroupFilter}
            ) a22`
    fs.writeFile('test.txt', query_5, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
    return query_5
}

async function parseDataFromQuery1(query) {
    const output = await fetchDataFromQuery(query);
    let rowCount = output['rows'].length;
    let data = [];
    let XC = [];
    let YC = [];

    if(covidStatusCheck){
        console.log(rowCount);
        console.log(output['metaData'].length);
    }
    for (let entry = 0; entry < rowCount; entry++) {
        let X1 = [];
        let Y1 = [];
        let X = [];
        let Y = [];
        let rows = output['rows'][entry];
        if(covidStatusCheck){
            for (let i = 1; i < 14; i++) {
                Y1.push(rows[i]);
                X1.push(i);
            }
            data.push([X1, Y1]);
            console.log("X1: " + X1);
            console.log("Y1: " + Y1);
        }
        else{
            for (let i = 1; i < output['metaData'].length; i++) {
                Y.push(rows[i]);
                X.push(i % 7);
            }
            data.push([X, Y]);
            console.log("X: " + X);
            console.log("Y: " + Y);
        }
    }

    let entry = 0;
    let rows = output['rows'][entry];
    if(covidStatusCheck){
        for (let i = 14; i < output['metaData'].length; i++) {
            YC.push(rows[i]);
            XC.push(i - 13);
        }
        data.push([XC, YC]);

        console.log("XC: " + XC);
        console.log("YC: " + YC);
        console.log("in covid check");
    }

    console.log("rowct: " + rowCount);
    console.log("data: " + data);
    
    
    return {
        "Data_Count": rowCount,
        "Data": data
    };
}


async function parseCountFromQuery(query) { 
    const output = await fetchDataFromQuery(query);
    let rows = output['rows'][0];
    let tupleCount = rows[0];
    
    return{
        "tupleCount": tupleCount,
    };
}

app.get('/count', function (req, res) {
    parseCountFromQuery(count).then((output) => {
        res.end(JSON.stringify(output))        
    })
})


app.get('/query_1_data', function (req, res) {
    console.log("REQ, ", req.query);
    if (req.query.season === '') {
        res.end(JSON.stringify({
            "Data_Count": 0,
            "Data": []
        }));
    }

    else {
        parseDataFromQuery1(generateQuery1(req.query.covidStatus, req.query.season, req.query.crimeGroups)).then((output) => {
            res.end(JSON.stringify(output))        
        })
    }
})

app.get('/query_2_data', function (req, res) {
    console.log("REQ, ", req.query);
    if (req.query.district === '') {
        res.end(JSON.stringify({
            "Data_Count": 0,
            "Data": []
        }));
    }

    else {
        parseDataFromQuery(generateQuery2(req.query.district, req.query.vehicleCrimeTypes)).then((output) => {
            res.end(JSON.stringify(output))        
        })
    }
})

app.get('/query_3_data', function (req, res) {
    console.log("REQ, ", req.query);
    if (req.query.descent === 'undefined' || req.query.sex === '' || req.query.ageStart === 'undefined' || req.query.ageEnd === 'undefined')  {
        res.end(JSON.stringify({
            "Data_Count": 0,
            "Data": []
        }));
    }

    else {
        console.log("called")
        parseDataFromQuery(generateQuery3(req.query.sex, req.query.descent, req.query.ageStart, req.query.ageEnd)).then((output) => {
            res.end(JSON.stringify(output))        
        })
    }
    
})

app.get('/query_4_data', function (req, res) {
    console.log("REQ, ", req.query);
    if (req.query.premises === '') {
        res.end(JSON.stringify({
            "Data_Count": 0,
            "Data": []
        }));
    }

    else {
        parseDataFromQuery(generateQuery4(req.query.premises, req.query.crimeGroups, req.query.time)).then((output) => {
            res.end(JSON.stringify(output))        
        })
    }
})

app.get('/query_5_data', function (req, res) {
    console.log("REQ, ", req.query);
    if (req.query.crimeGroups === '') {
        res.end(JSON.stringify({
            "Data_Count": 0,
            "Data": []
        }));
    }
    else{
        parseDataFromQuery5(generateQuery5(req.query.crimeGroups)).then((output) => {
            res.end(JSON.stringify(output))        
        })
    }
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})