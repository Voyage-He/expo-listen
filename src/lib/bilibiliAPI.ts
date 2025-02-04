import AsyncStorage from "@react-native-async-storage/async-storage";

const 
    userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56",
    storageKey = "@bilibiliAPI/buvid3";
// test bvid: BV1ArDCYaECL
// test cid: 26691569860

type Track = {
    id: string;
    title: string;
    author: string;
    pic: string;
}

export async function getBuvid3(): Promise<string> {
    let buvid3 = await AsyncStorage.getItem("@bilibiliAPI/buvid3");
    if (buvid3) return buvid3!;

    return fetch("https://api.bilibili.com/x/web-frontend/getbuvid", {
        headers: { "User-Agent": userAgent }
    })
      .then(response =>{
        if (!response.ok) {
            let error = new Error("Failed to get bilibili ID");
            error.name = "BilibiliAPIError";
            throw error;
        }
        return response.json();
      })
      .then(resonse_json => {
        buvid3 = resonse_json.data.buvid;
        AsyncStorage.setItem(storageKey, buvid3!);
        return buvid3!;
      })
}

export async function deleteBuvid3(): Promise<void> {
    await AsyncStorage.removeItem(storageKey);
}

export async function search(keyword: string): Promise<Track[]> {
    let params = new URLSearchParams({
            keyword: keyword,
            search_type: "video"
        })
    let response = await fetch(`http://api.bilibili.com/x/web-interface/search/type?${params.toString()}`,
        {
            headers: {
                "User-Agent": userAgent,
                Cookie: await getBuvid3() ?? ''
            },
        }
    )

    let res = await response.json();
    let data = res.data.result;

    let tracks = data.map((item: any) => {
        return {
            id: item.bvid,
            title: item.title.replaceAll(/<[^>]*>/g, ''),
            author: item.author,
            pic: "https:"+item.pic
        }
    })
    return tracks;
}

export async function getTrackInfo(bvid: string): Promise<Record<string, string>> {
    return fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56"
        }
    }).then(response => {
        if (!response.ok) {
            let error = new Error("Failed to get track info");
            error.name = "BilibiliAPIError";
            throw error;
        }
        return response.json();
    }).then(res => {
        let data = res.data;
        return {
            id: data.bvid,
            title: data.title,
            author: data.owner.name,
            pic: data.pic
        };
    });
}

async function getAudioUrl(bvid: string): Promise<string> {
    // get cid
    let response = await fetch(`https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`)
    let cid = (await response.json()).data[0].cid;

    // TODO Choose audio clarity.
    let params = new URLSearchParams({
        bvid,
        cid,
        fnval: "16"
    });
    response = await fetch(`https://api.bilibili.com/x/player/playurl?${params.toString()}`, {
        headers: {
            "User-Agent": userAgent
        }
    })
    let url = (await response.json()).data.dash.audio[0].baseUrl;

    return url;
}

export async function getAudioFile(bvid: string): Promise<ArrayBuffer> {
    let audioUrl = await getAudioUrl(bvid);
    let req = await fetch(audioUrl, {
        method: "GET",
        headers: {
            "User-Agent": userAgent,
            "Referer": "https://www.bilibili.com",
            "Host": new URL(audioUrl).hostname
        }
    });
    return await req.arrayBuffer();
}

// export async function downLoadAudio(bvid: string, directory: Directory = Directory.Documents): Promise<string> {
//     let audioFileData = await getAudioFile(bvid);

//     if ((await Filesystem.requestPermissions()).publicStorage == 'denied') {
//         throw "permission denied";
//     }
    
//     let witeFileRes =await Filesystem.writeFile({
//         path: "audioFiles/" + bvid,
//         data: audioFileData,
//         directory,
//         encoding: undefined,
//         recursive: true
//     })

//     return witeFileRes.uri;
// }