import { google } from 'googleapis';
import type { InquiryRequest } from '@/app/landing/types/inquiry';

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1ByjmWQK7C_ce64387ekohtKUI4ojdjhv3oJDtZk6xlo';
const SHEET_NAME = '신규 문의';

// Google Sheets 클라이언트 초기화
function getGoogleSheetsClient() {
  const credentials = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID || 'aerial-reef-476511-f8',
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID || '62445d9f06e49ccb786425faa2dca504c3e1b470',
    private_key: (process.env.GOOGLE_PRIVATE_KEY ||
      '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCRYV8S1Xl8vRVy\npY2BWmjzruFq2u+rCVBuPSldvtXyb84i+M8C4Cc/pbbkWEg+oXxBd9igUjcMdvOC\nBQiC4RexWlWSlFzAMwGMUjwlsSt1gUKiGe20m3Y9OHk0sASHfbX2loCp+JVVtjL5\nL3rdo90KgSu664lF4axMMn7P0whrRv8cBJufi1Qi/Zgiuy2jsIP5o7qaYnpg4jY8\nm+Hm2j/EMLssfwhQf6ezOj7XUSVo99NLA6HxhWizT4n2jE5BJxCYHd+3QsifYAEo\nfEoishC2J8246sv3OdG76wl3pedv97lbja6V7C3WJntkcvtZVUk/jUNFItfcjbHK\nFNphJ3fZAgMBAAECggEAA19A8WrEcT9hB5pdsoQGdm2GYsA+iibyh8YRJzChnYiY\nnVDMW26X1nb5a6k9Dr/X5hxZqNlTV82MByZm/MMsFaPo43gfwSEFvoubQ8wM3CJC\nCYjErdljyBZ+4Dkbd8mTjotN43NlwlnSK5u9c7Xk7wURProPInDyOke7D4a/dZ6E\nYd2P74kSTU6vTCb3zzpG2nCNIL8K0W6DndVsxXscae1ETL054c0JC+0vA0sf+i0m\npxdFaqqRPFkoY1LFdPkkHW5Ad0NMbmXORWj7/er9DG6ixPQfhHZiheT2RzF3O1Ul\nBwi7AihkB0ggy7DXeITZU2B6uNnGr86i/cStd7uRUQKBgQDC2ncQagMEKrtMZ5Dt\nsoLx6X7iEp8exkq8s67gixMAkgqt2otfu7/IOmzHRGwx8AgpDdjSdckkB1s458t7\nY8T8QoPVXAL06qbLnP1lBrY3TkhOFd3/2BZDlqwP6ks87DHyZlyQPUTqbCJFtnSm\nEgEtZrfOZZeq2S0pHPheHwQBUQKBgQC/AH5xEYjCwnnlB7l8joo+ecBWYrobC47b\nV4iNw0jKcPSF8NbyG3fXZQ9ooat/6lY7k2IsTqsLR7T0qx0QSs9si+97gKeDFw3u\ngP2IWr1lmNk2aCWJeys4YRM+fR/9IaIOaqIs/tieDSJyYPy6IssivBcONy3JqPN7\naLsFptGsCQKBgQCwQAwSvNGdo0loAwYE+8OWLi6nL1De9V4E8kLsuN+nVHJ0b4pC\nPgFri+15EVsMkKHRAMVvGTuna0AIaSKVqdk0lLXK+D90agwVgRtzlm6b+CNO/lig\nY0VAPbnFa5hCsyM6r3xqvADqSoV1qWQ6E28dMhxwhVR7JZbD6YB/Im7tAQKBgQCz\nF/h3dtSAoi//xBV1qIYR/MGPfrU4pMbH/rTJEGKRiAaQDPrPO1hMvLMNDgKsR4Oi\nCxlTqFQTmKIhhM0UuMDz6+abLFBlx9lFWOfh0gujVwXdURxZZAdrrwKHZnX3OXEm\nCXCVtkRRNsmk7DItKnDE2g7YQn8JhwT/I32x1/DkWQKBgHrE5Aga8j3aAcTmDh/x\nnKt4+n0clvmSnawdOB4L5GdCCGVzU3N3nTJJi/WA3Rw27Zad/BTmCYexQGQtO45X\nk/aY2PLu2Rh3MewvZ1i4WFU2FsrmDrDHyvZyCZymxYbXq2lMjyTEwKaRnA+Pmhag\nd5DD3SrwoHcKcDvuSk6NNzHE\n-----END PRIVATE KEY-----\n'
    ).replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL || 'bloom-464@aerial-reef-476511-f8.iam.gserviceaccount.com',
    client_id: process.env.GOOGLE_CLIENT_ID || '106078787961146434165',
  };

  const auth = new google.auth.GoogleAuth({
    // @ts-ignore - credentials type is complex
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Google Sheets에 문의 데이터 추가
export async function appendInquiryToSheet(data: InquiryRequest): Promise<void> {
  try {
    const sheets = getGoogleSheetsClient();
    const submittedAt = data.submittedAt ? new Date(data.submittedAt) : new Date();

    const values = [[
      data.referrerUrl || '',
      data.phoneNumber,
      data.installLocation,
      data.installCount,
      submittedAt.toISOString(),
      data.privacyConsent ? 'Y' : 'N',
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log(`✅ Google Sheets에 데이터 추가 완료: ${data.phoneNumber.slice(-4)}`);
  } catch (error) {
    console.error('❌ Google Sheets 저장 실패:', error);
    throw new Error('데이터 저장에 실패했습니다');
  }
}
