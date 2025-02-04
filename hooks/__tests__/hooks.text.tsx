import AsyncStorage from "@react-native-async-storage/async-storage";
import { render } from '@testing-library/react-native';
import useStorage from "../useStorage";

describe('hooks', () => {
  beforeAll(() => {
    vi.mock('@capacitor/preferences', () => {
      let state = {value: null};
      return {
        Preferences: {
          get: vi.fn().mockImplementation(() => Promise.resolve({ value: state.value })),
          set: vi.fn().mockImplementation(async ({ key, value }) => {
            state.value = value;
            // console.log(value);
            return Promise.resolve();
          }),
        },
      };
    });
    
  });
  
  test('useStorage with string', async () => {
    function TestComponent() {
      let [ storage, setStorage ] = useStorage("test", "initValue");
      
      expect(storage).toBe("initValue");
      delay(100).then(() => {
        expect(storage).toBe("initValue");
        setStorage("newValue");
        delay(100).then(() => {
          expect(storage()).toBe("newValue");
        });
      });
      
      return null;
    }

    render(() => <TestComponent />);
    await delay(1000);
    
    // Ensure `Preferences.set` was not called
    expect(Preferences.set).toHaveBeenCalled();
  });

//   test('useStorage with list', async () => {
//     function TestComponent() {
//       let [ storage, setStorage ] = useStorage(
//         "testKey",
//         ["initValue"],
//         {
//           parser: (value: string) => {
//             return JSON.parse(value);
//           },
//           serializer: (value: string[]) => {
//             return JSON.stringify(value);
//           }
//         }
//       );
      
//       expect(storage()).toEqual(["initValue"]);
//       delay(100).then(() => {
//         expect(storage()).toEqual(["initValue"]);
//         setStorage(["newValue"]);
//         delay(100).then(() => {
//           expect(storage()).toEqual(["newValue"]);
//         });
//       });
      
//       return null;
//     }

//     render(() => <TestComponent />);
//     await delay(1000);
    
//     // Ensure `Preferences.set` was not called
//     expect(Preferences.set).toHaveBeenCalled();
//   });

//   test('useTrackList', async () => {
//     function TestComponent() {
//       let [ trackList, add, remove ] = useTrackList('testKey');

//       expect(trackList()).toEqual([]);

//       (async () => {
//         await delay(100);
//         expect(trackList()).toEqual([]);

//         remove({id: "newValue", title: "testTitle", author: "testAuthor", pic: "testPic"});
//         await delay(100);
//         expect(trackList()).toEqual([]);

//         add({id: "testId", title: "testTitle", author: "testAuthor", pic: "testPic"});
//         await delay(100);
//         expect(trackList()).toEqual(["testId"]);
//       })();

//       return null;
//     }

//     render(() => <TestComponent />);
//     await delay(1000);
//   });
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
