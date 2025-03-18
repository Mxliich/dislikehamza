document.addEventListener('DOMContentLoaded', () => {
        const dislikeBtn = document.getElementById('dislike-hamza-btn');
        const likeBtn = document.getElementById('like-hamza-btn');
        const countDisplay = document.getElementById('count');
    
        let dislikeCount = 0;
    
        async function fetchDislikeCount() {
            try {
                const response = await fetch('/dislike/count');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                dislikeCount = data.count;
                countDisplay.textContent = dislikeCount;
            } catch (error) {
                console.error('Error fetching dislike count:', error);
                countDisplay.textContent = '0';
            }
        }
    
        async function incrementDislikeCount() {
            try {
                const response = await fetch('/dislike/increment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ increment: true })
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                dislikeCount = data.count;
                countDisplay.textContent = dislikeCount;
                
                dislikeBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    dislikeBtn.style.transform = 'scale(1)';
                }, 100);
            } catch (error) {
                console.error('Error incrementing dislike count:', error);
                alert('Error updating dislike count. Please try again.');
            }
        }
    
        likeBtn.addEventListener('click', () => {
            const videoContainer = document.createElement('div');
            videoContainer.style.position = 'fixed';
            videoContainer.style.top = '50%';
            videoContainer.style.left = '50%';
            videoContainer.style.transform = 'translate(-50%, -50%)';
            videoContainer.style.zIndex = '1000';
            videoContainer.style.width = '80vw';
            videoContainer.style.maxWidth = '800px';
            videoContainer.style.aspectRatio = '16/9';
            videoContainer.style.backgroundColor = '#000';
            videoContainer.style.borderRadius = '20px';
            videoContainer.style.overflow = 'hidden';
            videoContainer.style.boxShadow = '0 0 50px rgba(0,0,0,0.5)';

            const video = document.createElement('video');
            video.src = 'images/screaming.mp4';
            video.autoplay = true;
            video.controls = false;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';

            videoContainer.appendChild(video);
            document.body.appendChild(videoContainer);

            // Add overlay behind video
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
            overlay.style.zIndex = '999';
            document.body.appendChild(overlay);

            // Remove video and overlay when video ends
            video.addEventListener('ended', () => {
                overlay.style.opacity = '0';
                videoContainer.style.opacity = '0';
                overlay.style.transition = 'opacity 0.5s ease';
                videoContainer.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    document.body.removeChild(videoContainer);
                }, 500);
            });
        });
    
        dislikeBtn.addEventListener('click', incrementDislikeCount);
    
        fetchDislikeCount();
    });