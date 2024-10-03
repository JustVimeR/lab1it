import React from "react";

const WindowControls = ({ openColumnEditor }) => {
	return (
		<div style={styles.titleBar}>
			<div style={styles.customButtons}>
				<button onClick={openColumnEditor} style={styles.button}>
					Open Column Editor
				</button>
			</div>
		</div>
	);
};

const styles = {
	titleBar: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		height: "30px",
		backgroundColor: "#f0f0f0",
		padding: "0 10px",
		WebkitAppRegion: "drag",
	},
	customButtons: {
		display: "flex",
		gap: "10px",
	},
	button: {
		padding: "5px 10px",
		backgroundColor: "#007bff",
		border: "none",
		color: "white",
		cursor: "pointer",
		borderRadius: "4px",
	},
};

export default WindowControls;
