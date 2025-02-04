import { search, getTrackInfo, getAudioFile } from '../bilibiliAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fs from 'fs';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('search_test',() => {

  beforeAll(()=>{
    global.fetch = jest.fn().mockImplementation(async (url, config) =>{
      if (url.includes('buvid')) {
        return new Response(JSON.stringify({
          "code": 0,
          "data": {
            "buvid": "5DBF23C3-7630-6874-44BF-4B7E08ECEB7912977infoc"
          }
        }), {status: 200})
      }
      if (!config.headers.Cookie) {
        return new Response('', {status: 412})
      }
      return new Response(
        fs.readFileSync('./src/lib/__tests__/search_res.json'), 
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          }
        }
      );
    });
  })

  const asyncStorageValues = [
    null, 
    'wrong-buvid', 
    'buvid3=609092AB-FC14-4E0C-DD42-0BDC19A9118B38933infoc'
  ];
  const params = ['param1', 'param2'];

  test.each(asyncStorageValues.flatMap((asyncValue) =>
    params.map((param) => [asyncValue, param])
  ))('search', async (asyncValue, keyword)=>{
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(asyncValue);

    const tracks = await search(keyword as string);

    expect(tracks).not.toBeNull();
    expect(tracks.length).toBe(20);
    expect(tracks[0].title).toBe('search res, title of first track');
  })
});

describe('getTrackInfo_test',() => {
  beforeAll(()=>{
    global.fetch = jest.fn().mockImplementation(async (url, config) =>{
      return new Response(
        fs.readFileSync('./src/lib/__tests__/trackInfo_test.json'), 
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          }
        }
      );
    });
  })

  it('getTrackInfo', async () => {
    const trackInfo = await getTrackInfo('BV1fK411W71p');

    expect(trackInfo.title).toBe('“白衣过泥潭，怎敢说不染。”【祖娅纳惜】借过一下');
  })
})

describe('getAudioFile_test',() => {
  beforeAll(()=>{
    global.fetch = jest.fn().mockImplementation(async (url, config) =>{
      console.log(url);
      if (url.includes('https://api.bilibili.com/x/player/pagelist?bvid=')) {
        return new Response(
          fs.readFileSync('./src/lib/__tests__/pageList_res.json'), 
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            }
          }
        );
      }
      if (url.includes('https://api.bilibili.com/x/player/playurl')) {
        return new Response(
          fs.readFileSync('./src/lib/__tests__/playUrl_res.json'), 
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            }
          }
        );
      }
      
      if (config.headers.Referer == "https://www.bilibili.com") {
        return new Response(
          fs.readFileSync('./src/lib/__tests__/BV1ArDCYaECL.mp3').buffer,
          {
            status: 200,
          }
        )
      }
    });
  })

  it.only('getAudioFile_test', async () => {
    const audioFile = await getAudioFile('BV1ArDCYaECL');

    expect(audioFile).toBeInstanceOf(ArrayBuffer);
    fs.writeFileSync('./src/lib/__tests__/test.mp3', Buffer.from(audioFile));
  }, 25000)
})