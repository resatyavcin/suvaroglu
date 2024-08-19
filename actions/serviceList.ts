"use server"
import {google} from 'googleapis'

export const serviceList = async () => {

    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    )

    oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})
    try {

        const driveService = google.drive({
            version: 'v3',
            auth: oauth2Client
        })

        const res = await driveService.files.list({
            q: "mimeType=\'application/vnd.google-apps.folder\'",
            fields: 'nextPageToken, files(id, name, parents)',
            spaces: 'drive',
        });

        const responseData = (res.data.files || []).map((data:any)=>{
            const splitFolderName = data.name.split("/");

            return {
                customerName: splitFolderName[0] as string,
                customerSurname: splitFolderName[1] as string,
                customerVehicle: splitFolderName[2] as string,
                customerVehicleKM: splitFolderName[3] as string,
            }
        })

        console.log(responseData)

        return { success: "Araç dosyaları başarıyla getirildi.", data: responseData }
    } catch (err) {
        // TODO(developer) - Handle error
        throw err;
    }

}