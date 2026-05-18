import { useState, useEffect, useCallback } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Chip,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { api, Task, Category } from "../lib/api";
import { FormPaper } from "./styled";

export function TasksTab() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [categoryId, setCategoryId] = useState("");

	const loadTasks = useCallback(async () => {
		setTasks(await api.getTasks());
	}, []);

	const loadCategories = useCallback(async () => {
		setCategories(await api.getCategories());
	}, []);

	useEffect(() => {
		loadTasks();
		loadCategories();
	}, [loadTasks, loadCategories]);

	const handleCreate = async () => {
		if (!title.trim()) return;
		await api.createTask(title, description, categoryId || undefined);
		setTitle("");
		setDescription("");
		setCategoryId("");
		loadTasks();
	};

	const handleQuote = async () => {
		await api.createQuoteTask();
		loadTasks();
	};

	const handleStatusChange = async (id: string, status: Task["status"]) => {
		await api.updateTask(id, { status });
		loadTasks();
	};

	const handleCategoryChange = async (id: string, newCategoryId: string) => {
		await api.updateTask(id, { categoryId: newCategoryId || undefined });
		loadTasks();
	};

	const handleDelete = async (id: string) => {
		await api.deleteTask(id);
		loadTasks();
	};

	const getCategory = (catId?: string) => {
		if (!catId) return null;
		return categories.find((c) => c._id === catId) ?? null;
	};

	return (
		<Box>
			<FormPaper elevation={2}>
				<Typography variant="h6" gutterBottom>
					New Task
				</Typography>
				<Stack direction="row" spacing={2} alignItems="flex-end">
					<TextField
						label="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						size="small"
						sx={{ flex: 2 }}
					/>
					<TextField
						label="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						size="small"
						sx={{ flex: 2 }}
					/>
					<FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
						<InputLabel>Category</InputLabel>
						<Select
							value={categoryId}
							label="Category"
							onChange={(e) => setCategoryId(e.target.value)}
						>
							<MenuItem value="">None</MenuItem>
							{categories.map((cat) => (
								<MenuItem key={cat._id} value={cat._id}>
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Box
											sx={{
												width: 12,
												height: 12,
												borderRadius: "50%",
												backgroundColor: cat.color,
											}}
										/>
										{cat.name}
									</Box>
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={handleCreate}
					>
						Add
					</Button>
					<Button
						variant="outlined"
						startIcon={<FormatQuoteIcon />}
						onClick={handleQuote}
					>
						Quote
					</Button>
				</Stack>
			</FormPaper>

			<List>
				{tasks.map((task) => {
					const cat = getCategory(task.categoryId);
					return (
						<ListItem key={task._id} divider>
							<ListItemText
								primary={
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										{task.title}
										{cat && (
											<Chip
												label={cat.name}
												size="small"
												sx={{
													backgroundColor: cat.color,
													color: "#fff",
													fontWeight: 500,
												}}
											/>
										)}
									</Box>
								}
								secondary={task.description}
							/>
							<FormControl size="small" sx={{ minWidth: 130, mr: 1 }}>
								<InputLabel>Category</InputLabel>
								<Select
									value={task.categoryId || ""}
									label="Category"
									onChange={(e) =>
										handleCategoryChange(task._id, e.target.value)
									}
								>
									<MenuItem value="">None</MenuItem>
									{categories.map((c) => (
										<MenuItem key={c._id} value={c._id}>
											{c.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<FormControl size="small" sx={{ minWidth: 130, mr: 1 }}>
								<InputLabel>Status</InputLabel>
								<Select
									value={task.status}
									label="Status"
									onChange={(e) =>
										handleStatusChange(
											task._id,
											e.target.value as Task["status"],
										)
									}
								>
									<MenuItem value="pending">Pending</MenuItem>
									<MenuItem value="in-progress">In Progress</MenuItem>
									<MenuItem value="done">Done</MenuItem>
								</Select>
							</FormControl>
							<ListItemSecondaryAction>
								<IconButton edge="end" onClick={() => handleDelete(task._id)}>
									<DeleteIcon />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					);
				})}
				{tasks.length === 0 && (
					<Typography
						color="text.secondary"
						sx={{ py: 3, textAlign: "center" }}
					>
						No tasks yet. Create one above!
					</Typography>
				)}
			</List>
		</Box>
	);
}
