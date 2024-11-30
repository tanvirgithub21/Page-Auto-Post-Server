export const uploadVideoToFacebookReels = async (pageId, accessToken, videoUrl, description) => {
    try {
      // Step 1: Start upload process
      console.log("Starting upload phase...");
      const startResponse = await fetch(`https://graph.facebook.com/v21.0/${pageId}/video_reels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upload_phase: 'start',
          access_token: accessToken,
        }),
      });
  
      if (!startResponse.ok) {
        throw new Error(`Error starting upload: ${startResponse.status}`);
      }
  
      const startData = await startResponse.json();
      const { video_id, upload_url } = startData;
      console.log("Upload phase started:", startData);
  
      // Step 2: Upload video file
      console.log("Uploading video...");
      const uploadResponse = await fetch(upload_url, {
        method: 'POST',
        headers: {
          Authorization: `OAuth ${accessToken}`,
          file_url: videoUrl,
        },
      });
  
      if (!uploadResponse.ok) {
        throw new Error(`Error uploading video: ${uploadResponse.status}`);
      }
  
      const uploadData = await uploadResponse.json();
      console.log("Video uploaded:", uploadData);
  
      // Step 3: Finish upload process and publish video
      console.log("Finishing upload phase...");
      const finishUrl = `https://graph.facebook.com/v21.0/${pageId}/video_reels?access_token=${accessToken}&video_id=${video_id}&upload_phase=finish&video_state=PUBLISHED&description=${encodeURIComponent(
        description
      )}`;
      const finishResponse = await fetch(finishUrl, {
        method: 'POST',
      });
  
      if (!finishResponse.ok) {
        throw new Error(`Error finishing upload: ${finishResponse.status}`);
      }
  
      const finishData = await finishResponse.json();
      console.log("Video published:", finishData);
  
      return finishData;
    } catch (error) {
      console.error("Error in video upload process:", error.message);
      throw error;
    }
  };
  
