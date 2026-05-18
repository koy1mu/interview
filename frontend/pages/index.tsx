import { useState } from "react";
import { Typography, Tabs, Tab, Divider } from "@mui/material";
import { PageContainer } from "../components/styled";
import { TasksTab } from "../components/TasksTab";
import { CategoriesTab } from "../components/CategoriesTab";

export default function Home() {
	const [tab, setTab] = useState(0);

	return (
		<PageContainer maxWidth="md">
			<Typography variant="h4" gutterBottom>
				Task Manager
			</Typography>
			<Divider sx={{ mb: 2 }} />
			<Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
				<Tab label="Tasks" />
				<Tab label="Categories" />
			</Tabs>
			{tab === 0 && <TasksTab />}
			{tab === 1 && <CategoriesTab />}
		</PageContainer>
	);
}
