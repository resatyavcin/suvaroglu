import {NextRequest} from "next/server";
import {getMedias} from "@/actions/getMedias";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const data = await getMedias(body.filePath)

        return Response.json({status: 200, data: data});

    }catch (err){
        return Response.json({error: err});
    }
}
