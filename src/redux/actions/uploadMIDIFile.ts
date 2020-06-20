import { Dispatch } from "redux";
import { UPLOAD_MIDIFILE, MIDIFILE_LOADED } from "../../constants";
import { createSongFromMIDIFile } from "../../webdaw/sugar_coating";
import { outputs } from "../../media";

export const uploadMIDIFile = (file: File) => {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: UPLOAD_MIDIFILE,
    });
    const ab = await file.arrayBuffer();
    const song = await createSongFromMIDIFile(ab);
    console.log(song);
    song.tracks.forEach(track => {
      track.outputs.push(...outputs.map(o => o.id));
      // track.outputs = outputs.map(o => o.id);
    });

    dispatch({
      type: MIDIFILE_LOADED,
      payload: { interpretation: { name: file.name, file: song } },
    });
  };
};
