// Fetch the JSON data and log it
d3.json("https://static.bc-edx.com/data/dla-1-2/m14/lms/starter/samples.json").then(data => {
    console.log(data);

    // Populate the dropdown menu
    let dropdown = d3.select("#selDataset");
    data.names.forEach(name => {
        dropdown.append("option").text(name).property("value", name);
    });

    // Initialize with the first sample
    let initialSample = data.names[0];
    updateCharts(initialSample);
    updateMetadata(initialSample);
});

// Function to handle change in dropdown selection
function optionChanged(newSample) {
    updateCharts(newSample);
    updateMetadata(newSample);
}

// Function to update charts
function updateCharts(sample) {
    // Filter the data for the selected sample
    d3.json("https://static.bc-edx.com/data/dla-1-2/m14/lms/starter/samples.json").then(data => {
        let samples = data.samples.filter(s => s.id === sample)[0];

        // Bar chart
        let top10Values = samples.sample_values.slice(0, 10).reverse();
        let top10Labels = samples.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        let top10Hovertext = samples.otu_labels.slice(0, 10).reverse();

        let barData = [
            {
                x: top10Values,
                y: top10Labels,
                text: top10Hovertext,
                type: "bar",
                orientation: "h",
                marker: {
                    color: 'rgb(29, 145, 192)'
                }
            }
        ];
        let barLayout = {
           title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150, r: 30 },
            xaxis: {
                title: "Number of Bacteria"
            },
            yaxis: {
                automargin: true
            },
            width: document.getElementById('bar').offsetWidth,
            plot_bgcolor: "#f8f9fa",
            paper_bgcolor: "#f8f9fa"
        };
        Plotly.newPlot("bar", barData, barLayout);

        // Bubble chart
        let bubbleData = [
            {
                x: samples.otu_ids,
                y: samples.sample_values,
                text: samples.otu_labels.map(text => text.toUpperCase()),
                mode: "markers",
                marker: {
                    size: samples.sample_values,
                    color: samples.otu_ids,
                    colorscale: "Earth"
                }
            }
        ];
        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 30 },
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Number of Bacteria" },
            plot_bgcolor: "#f8f9fa",
            paper_bgcolor: "#f8f9fa"
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// Function to update metadata
function updateMetadata(sample) {
    d3.json("https://static.bc-edx.com/data/dla-1-2/m14/lms/starter/samples.json").then(data => {
        let metadata = data.metadata.filter(m => m.id === parseInt(sample))[0];
        let sampleMetadata = d3.select("#sample-metadata");
        sampleMetadata.html("");
        Object.entries(metadata).forEach(([key, value]) => {
            sampleMetadata.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}
