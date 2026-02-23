import {Queue} from 'bullmq';


export const documentQueue = new Queue("document-processing");

async function init() {
    const res = await documentQueue.add("chunking", {
        userId: session.user.id,
        fileUrl: imageKitRes.url,
        fileName: imageKitRes.name,
        status: "PROCESSING",
    })
}


