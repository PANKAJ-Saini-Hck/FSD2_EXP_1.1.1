import React, { useState } from "react";
import "./PostComposer.css";

const platforms = {
  Twitter: {
    limit: 280,
    media: true,
  },
  Facebook: {
    limit: 5000,
    media: true,
  },
  Instagram: {
    limit: 2200,
    media: true,
  },
  LinkedIn: {
    limit: 3000,
    media: false,
  },
};

function PostComposer() {
  const [text, setText] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");

  const togglePlatform = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(
        selectedPlatforms.filter((p) => p !== platform)
      );
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleFile = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handlePublish = () => {
    setMessage("");

    if (selectedPlatforms.length === 0) {
      setMessage("❌ Please select at least one platform.");
      return;
    }

    if (text.trim() === "") {
      setMessage("❌ Post cannot be empty.");
      return;
    }

    for (let platform of selectedPlatforms) {
      if (text.length > platforms[platform].limit) {
        setMessage(`❌ ${platform} character limit exceeded.`);
        return;
      }

      if (!platforms[platform].media && fileName) {
        setMessage(`❌ ${platform} does not support media uploads.`);
        return;
      }
    }

    setMessage("✅ Post Published Successfully!");

    setText("");
    setSelectedPlatforms([]);
    setFileName("");

    document.querySelector('input[type="file"]').value = "";
  };

  return (
    <div className="container">

      <h2>📢 Multi Platform Post Composer</h2>

      <textarea
        placeholder="Write your post..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <h3>Select Platforms</h3>

      {Object.keys(platforms).map((platform) => (
        <label key={platform} className="platform">
          <input
            type="checkbox"
            checked={selectedPlatforms.includes(platform)}
            onChange={() => togglePlatform(platform)}
          />
          {platform}
        </label>
      ))}

      <br />

      <input type="file" onChange={handleFile} />

      {fileName && (
        <p className="file">
          📎 Attached File : <strong>{fileName}</strong>
        </p>
      )}

      <hr />

      {selectedPlatforms.map((platform) => {
        const limit = platforms[platform].limit;
        const remaining = limit - text.length;

        return (
          <div className="feedback" key={platform}>

            <h4>{platform}</h4>

            <p>
              Characters : <strong>{text.length}</strong> / {limit}
            </p>

            {remaining < 0 ? (
              <p className="error">
                ❌ Character limit exceeded by {-remaining}
              </p>
            ) : remaining <= 20 ? (
              <p className="warning">
                ⚠ Only {remaining} characters remaining
              </p>
            ) : (
              <p className="success">
                ✅ Valid Post
              </p>
            )}

            {!platforms[platform].media && fileName && (
              <p className="error">
                ❌ Media upload not supported.
              </p>
            )}

          </div>
        );
      })}

      <button onClick={handlePublish}>
        🚀 Publish Post
      </button>

      {message && (
        <div
          className={
            message.startsWith("✅")
              ? "publish-success"
              : "publish-error"
          }
        >
          {message}
        </div>
      )}

    </div>
  );
}

export default PostComposer;