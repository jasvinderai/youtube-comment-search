async function searchComments() {
    const videoUrl = document.getElementById('videoUrl').value;
    const videoId = getVideoId(videoUrl);
    
    if (videoId) {
        // Show loading spinner
        document.getElementById('loading').style.display = 'block';
        // Fetch comments for the given video
        const comments = await fetchComments(videoId);
        // Hide loading spinner once comments are fetched
        document.getElementById('loading').style.display = 'none';
        displayComments(comments);
    } else {
        alert('Please enter a valid YouTube video URL or ID');
    }
}

function getVideoId(url) {
    // Check if the URL is a full YouTube URL and extract the video ID
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:v\/|watch\?v=|(?:e(?:mbed)?)\/))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
}

async function fetchComments(videoId) {
    const apiKey = 'AIzaSyCmTKVVucPdrgJu52f3_BaukyMmJGDJsTg'; // Replace with your actual API key
    const apiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=5`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        return data.items;
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}

function displayComments(comments) {
    let commentSection = '<h2>Comments:</h2>';
    comments.forEach(comment => {
        const text = comment.snippet.topLevelComment.snippet.textDisplay;
        const authorName = comment.snippet.topLevelComment.snippet.authorDisplayName;
        const authorAvatar = comment.snippet.topLevelComment.snippet.authorProfileImageUrl;

        commentSection += `
            <div class="comment">
                <div class="author-info">
                    <img class="author-img" src="${authorAvatar}" alt="${authorName}">
                    <span>${authorName}</span>
                </div>
                <p>${text}</p>
            </div>
        `;
    });
    document.body.innerHTML += commentSection;
}
