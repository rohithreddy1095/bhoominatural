# Bhoomi Video Analyzer Skill

You are a deep analysis assistant for Bhoomi Natural YouTube content. This skill complements `/bhoomi` by providing detailed analysis of individual videos.

---

## Purpose

Analyze YouTube videos from Bhoomi Natural channel to extract:
- Detailed content breakdown
- Key topics and techniques mentioned
- Plants/crops featured
- Locations shown
- Quotes and insights
- Content suitable for website/app repurposing

---

## How to Analyze a Video

When given a YouTube URL or video ID:

### Step 1: Fetch Video Details
```bash
yt-dlp --skip-download --print "%(title)s|%(description)s|%(duration)s|%(view_count)s|%(upload_date)s" "VIDEO_URL"
```

### Step 2: Get Full Description
```bash
yt-dlp --skip-download --print "%(description)s" "VIDEO_URL"
```

### Step 3: Attempt Transcript (if available)
```bash
yt-dlp --skip-download --write-auto-sub --sub-lang hi,en --convert-subs srt -o "transcript" "VIDEO_URL"
```

---

## Analysis Template

When analyzing a video, produce this structured output:

```markdown
## Video Analysis: [Title]

### Basic Info
- **URL**: [url]
- **Duration**: [duration]
- **Views**: [count]
- **Upload Date**: [date]

### Content Summary
[2-3 sentence summary of what the video covers]

### Key Topics
- [Topic 1]
- [Topic 2]
- [Topic 3]

### Plants/Crops Featured
- [Plant 1] - [context]
- [Plant 2] - [context]

### Techniques Demonstrated
- [Technique 1]
- [Technique 2]

### Location
- [Location if mentioned]

### Quotes/Insights
> "[Notable quote or insight from the video]"

### Website Content Potential
- [ ] Blog post topic
- [ ] Gallery images
- [ ] Service description
- [ ] Testimonial

### App Content Potential
- [ ] Farming tip
- [ ] Plant database entry
- [ ] Tutorial content
```

---

## Batch Analysis

To analyze multiple videos, iterate through refs/youtube/video_links.md:

```python
import json

with open('refs/youtube/videos.json') as f:
    data = json.load(f)

for entry in data['entries']:
    video_id = entry['id']
    title = entry['title']
    # Analyze each video
```

---

## Content Categories

Classify videos into these categories for organization:

| Category | Description | Website Use | App Use |
|----------|-------------|-------------|---------|
| **Farm Tour** | Walkthrough of food forests | Gallery, About | Video section |
| **Transformation** | Before/after projects | Services, Case Studies | Portfolio |
| **Tutorial** | How-to content | Blog posts | Learning section |
| **Harvest** | Seasonal produce | Gallery, Blog | Seasonal tips |
| **Client Project** | Work for others | Testimonials, Services | Case studies |

---

## Extracted Data Storage

Save analysis results to:
```
refs/youtube/analysis/
├── [video_id].md      # Individual video analysis
├── summary.json       # Aggregated metadata
└── categories.json    # Video categorization
```

---

## Integration with /bhoomi

After analyzing videos, update the main skill's knowledge:
1. Add new plant varieties discovered
2. Update location list
3. Add new techniques to the knowledge base
4. Identify best content for website/app

---

## Example Usage

User: "Analyze this video: https://www.youtube.com/watch?v=6ncpHq-ppbo"

Assistant will:
1. Fetch video metadata using yt-dlp
2. Extract description and any available subtitles
3. Produce structured analysis
4. Suggest content repurposing opportunities
5. Save analysis to refs/youtube/analysis/

---

## Quick Commands

```bash
# Get video info
yt-dlp --skip-download -j "VIDEO_URL" | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'Title: {d[\"title\"]}\nDesc: {d[\"description\"][:500]}')"

# List all video IDs
python3 -c "import json; d=json.load(open('refs/youtube/videos.json')); [print(e['id'], e['title'][:50]) for e in d['entries']]"

# Get description for a video
yt-dlp --skip-download --print "%(description)s" "https://www.youtube.com/watch?v=VIDEO_ID"
```

---

## Notes

- Some videos may have Hindi descriptions - translate key points
- Older videos may lack detailed descriptions
- Cross-reference with social media posts for additional context
- Videos often feature the same farm from different angles/seasons
