// import { Filesystem, Directory } from "@capacitor/filesystem";
// import { type Track } from "@lib/track";

const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56";

// test bvid: BV1ArDCYaECL

export async function search(keyword: string): Promise<Map<string, string>> {
    let params = new URLSearchParams({
            keyword: keyword,
            search_type: "video"
        })
    let response = await fetch(`http://api.bilibili.com/x/web-interface/search/type?${params.toString()}`,
        {
            headers: {
                "User-Agent": userAgent,
                "Cookie": "buvid3=C95DB837-8C05-7DFE-364D-FED1D3D34D2089518infoc"
            }
        }
    )
    // var bvid = res.json()['data']['result'][0]['bvid'] as String;
    // print(bvid.split(RegExp(r'BV[\w+]'))[1]);

    // return BilibiliVideoModel.fromList(res.json()["data"]['result']);
    let res = await response.json();
    let data = res.data.result;

    let tracks = data.map((item: any) => {
        return {
            id: item.bvid.slice(2),
            title: item.title.replaceAll(/<[^>]*>/g, ''),
            author: item.author,
            pic: "https:"+item.pic
        }
    })
    return tracks;
}

// export async function getTrackInfo(bvid: string): Promise<string[]> {
//     let response = await fetch({
//         url: "https://api.bilibili.com/x/web-interface/view",
//         method: "GET",
//         headers: {
//             "User-Agent":
//                 "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56"
//         },
//         params: {
//             bvid: bvid
//         }
//     })
//     // String bvid2 = res.json()['data']['bvid'];
//     // String title = res.json()['data']['title'];
//     // String pic = res.json()['data']['pic'];
//     // String author = res.json()['data']['owner']['name']
//     //     return [bvid, title, author, pic];
//     console.log(response.data.data);
//     return response.data;
// }

// async function getAudioUrl(bvid: string): Promise<string> {
//     // get cid
//     let response = await fetch({
//         url: "https://api.bilibili.com/x/player/pagelist",
//         method: "GET",
//         params: {
//             bvid: bvid
//         }
//     })
//     let cid = response.data.data[0].cid;

//     // TODO Choose audio clarity.
//     response = await http.request({
//         url: "https://api.bilibili.com/x/player/playurl",
//         method: "GET",
//         headers: {
//             "User-Agent": userAgent
//         },
//         params: {
//             bvid: bvid,
//             cid: cid,
//             fnval: "16"
//         }
//     })
//     let url = response.data.data.dash.audio[0].baseUrl;

//     return url; 
//     // return res.json()['data']['dash']['audio'][0]['baseUrl'];
// }

// async function getAudioFile(bvid: string): Promise<any> {
//     var audioUrl = await getAudioUrl(bvid);

//     var req = await http.request({
//         url: audioUrl,
//         method: "GET",
//         responseType: "arraybuffer",
//         headers: {
//             "User-Agent": userAgent,
//             "Referer": "https://www.bilibili.com",
//             "Host": new URL(audioUrl).hostname
//         }
//     });
//     return req.data;
// }

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