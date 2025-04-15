$(document).ready(function() {
    $.getJSON('http://127.0.0.1:5000/api/openday', function(openDayData) {
        $('#bannerImage').attr('src', openDayData.cover_image);
        $('#pageTitle').text(openDayData.description);

        const topics = openDayData.topics;

        // Populate the topics dropdown in the header
        function populateTopicsDropdown() {
            const topicsMenu = $('#topicsMenu .topics-columns');
            topicsMenu.empty();

            const itemsPerColumn = 8; // Maximum items per column
            const totalTopics = topics.length;
            const numColumns = Math.ceil(totalTopics / itemsPerColumn); // Number of columns needed

            // Split topics into columns
            for (let col = 0; col < numColumns; col++) {
                const startIdx = col * itemsPerColumn;
                const endIdx = Math.min(startIdx + itemsPerColumn, totalTopics);
                const columnTopics = topics.slice(startIdx, endIdx);

                const columnHtml = `
                    <div class="topics-column">
                        ${columnTopics.map(topic => {
                            const programs = topic.programs || [];
                            const programItems = programs.length > 0
                                ? programs.map(program => `
                                    <li>
                                        <a class="dropdown-item program-item" href="#${topic.id}">
                                            ${program.title || 'Untitled Program'}
                                        </a>
                                    </li>
                                `).join('')
                                : '<li><a class="dropdown-item program-item" href="#">No programs available</a></li>';

                            return `
                                <div class="nested-dropdown">
                                    <a class="topic-item" href="#${topic.id}">
                                        ${topic.name}
                                    </a>
                                    <ul class="dropdown-menu">
                                        ${programItems}
                                    </ul>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
                topicsMenu.append(columnHtml);
            }
        }

        function cleanDescription(description) {
            if (!description) return 'No description available';
            return description
                .replace(/Â/g, '')
                .replace(/€/g, '')
                .replace(/™/g, '')
                .replace(/â/g, '');
        }

        function renderTiles(filteredTopics) {
            const tilesContainer = $('#tilesContainer');
            tilesContainer.empty();

            if (filteredTopics.length === 0) {
                tilesContainer.html('<p class="text-center text-muted">No matching topics found.</p>');
                return;
            }

            filteredTopics.forEach(topic => {
                const startDateTime = new Date(openDayData.start_time).toLocaleString([], {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const endDateTime = new Date(openDayData.end_time).toLocaleString([], {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const cleanedDescription = cleanDescription(topic.description);

                const tileHtml = `
                    <div class="tile p-2">
                        <div class="card h-100">
                            <img src="${topic.cover_image}" class="card-img-top tile-img" alt="${topic.name}">
                            <div class="card-body">
                                <h5 class="card-title">${topic.name}</h5>
                                <p class="card-text">${cleanedDescription}</p>
                                <p class="card-text"><small class="text-muted">Start: ${startDateTime}</small></p>
                                <p class="card-text"><small class="text-muted">End: ${endDateTime}</small></p>
                                <button class="btn btn-primary mt-auto more-info-btn" data-topic-id="${topic.id}">More Info</button>
                            </div>
                        </div>
                    </div>
                `;
                tilesContainer.append(tileHtml);
            });

            $('.more-info-btn').on('click', function() {
                const topicId = $(this).data('topic-id');
                window.location.href = `topic.html?topicId=${topicId}`;
            });
        }

        function sortTopics(topicsToSort, criteria) {
            let sortedTopics = [...topicsToSort];
            switch (criteria) {
                case 'title-asc':
                    sortedTopics.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'title-desc':
                    sortedTopics.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                    case 'start-asc':
                        // Assuming topics should have individual start times, if not then use program times
                        sortedTopics.sort((a, b) => {
                            const aStart = a.programs && a.programs.length > 0
                                ? new Date(Math.min(...a.programs.map(p => new Date(p.start_time))))
                                : new Date(openDayData.start_time);
                            const bStart = b.programs && b.programs.length > 0
                                ? new Date(Math.min(...b.programs.map(p => new Date(p.start_time))))
                                : new Date(openDayData.start_time);
                            return aStart - bStart;
                        });
                        break;
                    case 'start-desc':
                        sortedTopics.sort((a, b) => {
                            const bStart = b.programs && b.programs.length > 0
                                ? new Date(Math.min(...b.programs.map(p => new Date(p.start_time))))
                                : new Date(openDayData.start_time);
                            const aStart = a.programs && a.programs.length > 0
                                ? new Date(Math.min(...a.programs.map(p => new Date(p.start_time))))
                                : new Date(openDayData.start_time);
                            return bStart - aStart;
                        });
                        break;
                default:
                    break;
            }
            return sortedTopics;
        }

        function searchTopics(searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            if (!term) return topics;
            return topics.filter(topic => 
                topic.name.toLowerCase().includes(term) || 
                (topic.description && topic.description.toLowerCase().includes(term))
            );
        }

        let currentSortCriteria = 'title-asc';

        function updateDisplay() {
            const searchTerm = $('#searchInput').val();
            
            let filteredTopics = searchTopics(searchTerm);
            filteredTopics = sortTopics(filteredTopics, currentSortCriteria);
            renderTiles(filteredTopics);
        }

        $('#searchInput').on('input', updateDisplay);
        $('#clearSearch').on('click', function() {
            $('#searchInput').val('');
            updateDisplay();
        });

        $('#sortByDropdown .sort-option').on('click', function(e) {
            e.preventDefault();
            const selectedText = $(this).text();
            $('#sortByButton').text(selectedText);
            currentSortCriteria = $(this).data('value');
            $('#sortByDropdown .sort-option').removeClass('active');
            $(this).addClass('active');
            updateDisplay();
        });

        populateTopicsDropdown();
        updateDisplay();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error fetching JSON:', textStatus, errorThrown);
        console.error('Status Code:', jqXHR.status);
        console.error('Response Text:', jqXHR.responseText);
        $('#tilesContainer').html('<p class="text-danger text-center">Failed to load data: ' + textStatus + ' - ' + errorThrown + '</p>');
    });
});