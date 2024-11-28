import { useCallback, useEffect, useState } from 'react';
import {
	Typography,
	Button,
	Input,
	Grid,
	Box,
	IconButton,
	Select,
	Option,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@mui/joy';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
	ProductSelectionModal,
	Product,
	Variant,
} from './components/ProductSelectionModel';
import React from 'react';

export const AddProducts = () => {
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [productModelVisible, setProductModelVisible] =
		useState<boolean>(false);

	const emptyProduct: Product = {
		id: '',
		title: '',
		color: '',
		size: '',
		price: 0,
		available: 0,
		image: undefined,
		variants: [],
		checked: false,
	};

	const [productMap, setProductMap] = useState<Map<number, Product>>(() => {
		const initialMap = new Map<number, Product>();
		initialMap.set(0, emptyProduct);
		return initialMap;
	});

	const [showDiscountUI, setShowDiscountUI] = useState(
		Array(Array.from(productMap).length).fill(false)
	);

	const addToProductMap = (key: number, product: Product) => {
		setProductMap((prevMap) => {
			const newMap = new Map(prevMap);
			newMap.set(key, product);
			return newMap;
		});
	};

	const removeFromProductMap = (key: number) => {
		setProductMap((prevMap) => {
			const newMap = new Map(prevMap);
			newMap.delete(key);
			return newMap;
		});
	};

	const handleRemoveVariant = (key: number, variantId: string) => {
		const product = productMap.get(key);
		if (product) {
			product.variants = product.variants.filter(
				(item) => item.id !== variantId
			);
			addToProductMap(key, product);
		}
	};

	// Update handleAddProduct
	const handleAddProduct = () => {
		const length = Array.from(productMap).length;
		addToProductMap(length, emptyProduct);
		setShowDiscountUI((prev) => [...prev, false]);
	};

	return (
		<Box sx={{ padding: 4, maxWidth: 600, margin: 'auto' }}>
			<Typography level="title-lg" sx={{ marginBottom: 2 }}>
				Add Products
			</Typography>
			<Grid
				display="flex"
				flexDirection="row"
				justifyContent="space-around"
				alignItems="center"
				gap={10}
				mb={2}
			>
				<Typography level="title-md">Product</Typography>
				<Typography level="title-md">Discount</Typography>
			</Grid>

			{Array.from(productMap.entries()).map(([mapKey, item], index) => (
				<React.Fragment key={`${mapKey}-${item.id}-${item.title}`}>
					<ProductItem
						productIndex={mapKey}
						productMap={productMap}
						setProductMap={setProductMap}
						index={index}
						item={item}
						setProductModelVisible={setProductModelVisible}
						setSelectedIndex={setSelectedIndex}
						showDiscountUI={showDiscountUI}
						setShowDiscountUI={setShowDiscountUI}
						removeFromProductMap={removeFromProductMap}
						handleRemoveVariant={handleRemoveVariant}
					/>
				</React.Fragment>
			))}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginTop: 2,
				}}
			>
				<Button variant="outlined" onClick={handleAddProduct}>
					Add Product
				</Button>
			</Box>
			<ProductSelectionModal
				productModelVisible={productModelVisible}
				setProductModelVisible={setProductModelVisible}
				selectedIndex={selectedIndex}
				addToProductMap={addToProductMap}
			/>
		</Box>
	);
};

interface ProductItemProps {
	productIndex: number;
	productMap: Map<number, Product>;
	setProductMap: React.Dispatch<React.SetStateAction<Map<number, Product>>>;
	index: number;
	item: Product;
	setProductModelVisible?: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedIndex?: React.Dispatch<React.SetStateAction<number>>;
	showDiscountUI: boolean[];
	setShowDiscountUI: React.Dispatch<React.SetStateAction<boolean[]>>;
	removeFromProductMap: (key: number) => void;
	handleRemoveVariant: (key: number, variantId: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = React.memo(
	({
		productIndex,
		productMap,
		setProductMap,
		index,
		item,
		setProductModelVisible,
		setSelectedIndex,
		showDiscountUI,
		setShowDiscountUI,
		removeFromProductMap,
		handleRemoveVariant,
	}) => {
		const [isDragging, setIsDragging] = useState(false);

		// Drag and drop handlers
		const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
			e.dataTransfer?.setData('text/plain', productIndex.toString());
			setIsDragging(true);

			e.currentTarget.style.opacity = '0.5';
		};

		const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
			e.currentTarget.style.opacity = '1';
			setIsDragging(false);
		};

		const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault(); // Necessary to allow dropping
		};

		const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();

			// Retrieve the dragged item's index
			const draggedItemIndex = parseInt(
				e.dataTransfer?.getData('text/plain') || '-1',
				10
			);

			// Prevent dropping on itself
			if (draggedItemIndex === productIndex) return;

			// Reorder products
			setProductMap((prevMap) => {
				// Convert map to array for easy manipulation
				const productsArray = Array.from(prevMap.entries());

				// Find the indices of dragged and target items
				const draggedItemPosition = productsArray.findIndex(
					([key]) => key === draggedItemIndex
				);
				const targetPosition = productsArray.findIndex(
					([key]) => key === productIndex
				);

				// Remove the dragged item
				const [removedItem] = productsArray.splice(
					draggedItemPosition,
					1
				);

				// Insert at the new position
				productsArray.splice(targetPosition, 0, removedItem);

				// Recreate map with new order and reset keys
				return new Map(
					productsArray.map((item, newIndex) => [newIndex, item[1]])
				);
			});

			// Reset dragging state
			setIsDragging(false);
		};
		const handleVariantReorder = useCallback(
			(productIndex: number, reorderedVariants: Variant[]) => {
				setProductMap((prevMap) => {
					const newMap = new Map(prevMap);
					const product = newMap.get(productIndex);

					// Update the product's variants if the product exists
					if (product) {
						const updatedProduct = {
							...product,
							variants: reorderedVariants,
						};
						newMap.set(productIndex, updatedProduct);
					}

					return newMap;
				});
			},
			[]
		);
		return (
			<Box
				mt={1}
				sx={{
					// border: isDragging ? '1px dashed grey' : 'none',
					cursor: 'grab',
					opacity: isDragging ? 0.5 : 1,
				}}
				draggable
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				<Grid
					display={'flex'}
					direction={'row'}
					alignItems={'center'}
					justifyContent="space-between"
				>
					<IconButton>
						<DragIndicatorIcon />
					</IconButton>
					<Typography level="body-md" textColor={'background.level3'}>
						{index + 1}
					</Typography>
					<Input
						placeholder="Select Product"
						value={item.title}
						sx={{
							minWidth: 250,
							'--Input-focusedThickness': '0px',
						}}
						endDecorator={
							setProductModelVisible && setSelectedIndex ? (
								<IconButton
									onClick={() => {
										setProductModelVisible(true);
										setSelectedIndex(index);
									}}
								>
									<EditIcon />
								</IconButton>
							) : null
						}
					/>
					<Grid display={'flex'} direction={'row'} maxWidth={200}>
						{showDiscountUI && showDiscountUI[index] ? (
							<Grid display="flex" gap={1} sx={{ width: '100%' }}>
								<Input placeholder="Discount" />
								<Select sx={{ minWidth: 100 }}>
									<Option value="20">Flat Off</Option>
									<Option value="30">% Off</Option>
								</Select>
							</Grid>
						) : (
							<Button
								variant="solid"
								sx={{ p: 2, maxHeight: 10, minWidth: 180 }}
								onClick={() => {
									const updatedShowDiscountUI = [
										...showDiscountUI,
									];
									updatedShowDiscountUI[index] =
										!updatedShowDiscountUI[index];
									setShowDiscountUI(updatedShowDiscountUI);
								}}
							>
								Add Discount
							</Button>
						)}
						{Array.from(productMap).length > 1 && (
							<IconButton
								onClick={() => removeFromProductMap(index)}
							>
								<ClearIcon />
							</IconButton>
						)}
					</Grid>
				</Grid>
				{item.variants?.length > 0 && (
					<ProductVariantsAccordion
						productIndex={productIndex}
						variants={item.variants.filter(
							(variant) => variant.checked
						)}
						showDiscountUI={showDiscountUI}
						setShowDiscountUI={setShowDiscountUI}
						handleRemoveVariant={handleRemoveVariant}
						onVariantReorder={(reorderedVariants) =>
							handleVariantReorder(
								productIndex,
								reorderedVariants
							)
						}
					/>
				)}
			</Box>
		);
	}
);

interface ProductVariantsAccordionProps {
	productIndex: number;
	variants: Variant[];
	showDiscountUI: boolean[];
	setShowDiscountUI: React.Dispatch<React.SetStateAction<boolean[]>>;
	handleRemoveVariant: (key: number, variantId: string) => void;
	onVariantReorder?: (variants: Variant[]) => void;
}

const ProductVariantsAccordion: React.FC<ProductVariantsAccordionProps> = ({
	productIndex,
	showDiscountUI,
	setShowDiscountUI,
	variants,
	handleRemoveVariant,
	onVariantReorder,
}) => {
	const [localVariants, setLocalVariants] = useState(variants);
	const [draggedVariant, setDraggedVariant] = useState<number | null>(null);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	useEffect(() => {
		setLocalVariants(variants);
	}, [variants]);

	const handleDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		index: number
	) => {
		setDraggedVariant(index);
		e.dataTransfer?.setData('text/plain', index.toString());
		e.currentTarget.style.opacity = '0.5';
	};

	const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
		e.currentTarget.style.opacity = '1';
		setDraggedVariant(null);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleDrop = (
		e: React.DragEvent<HTMLDivElement>,
		targetIndex: number
	) => {
		e.preventDefault();

		if (draggedVariant === null || draggedVariant === targetIndex) return;

		const updatedVariants = [...localVariants];

		// Remove the dragged variant
		const [removedVariant] = updatedVariants.splice(draggedVariant, 1);
		updatedVariants.splice(targetIndex, 0, removedVariant);

		// Update local state
		setLocalVariants(updatedVariants);

		// Update parent state
		if (onVariantReorder) {
			onVariantReorder(updatedVariants);
		}

		setDraggedVariant(null);
	};

	return (
		<Box ml={3}>
			<Accordion expanded={isExpanded}>
				<AccordionSummary
					sx={{ display: 'block', ml: '355px' }}
					onClick={() => setIsExpanded(!isExpanded)}
				>
					{isExpanded ? (
						<Typography level="body-sm">Hide variants</Typography>
					) : (
						<Typography level="body-sm">Show variants</Typography>
					)}
				</AccordionSummary>
				<AccordionDetails>
					{localVariants.map((variant, index) => (
						<Grid
							key={`${variant.title}-${variant.id}`}
							display={'flex'}
							direction={'row'}
							alignItems={'center'}
							mb={0.5}
							gap={1}
							sx={{
								opacity: draggedVariant === index ? 0.5 : 1,
								cursor: 'grab',
							}}
							draggable
							onDragStart={(e) => handleDragStart(e, index)}
							onDragEnd={handleDragEnd}
							onDragOver={handleDragOver}
							onDrop={(e) => handleDrop(e, index)}
						>
							<IconButton size="sm">
								<DragIndicatorIcon />
							</IconButton>
							<Input
								placeholder="Select Product"
								value={variant.title}
								size="sm"
								sx={{
									minWidth: 300,
									'--Input-focusedThickness': '0px',
								}}
							/>
							<Grid
								maxWidth={180}
								display={'flex'}
								direction={'row'}
								alignItems={'center'}
								gap={1}
							>
								{showDiscountUI[index] ? (
									<Grid
										display="flex"
										gap={1}
										sx={{ width: '100%' }}
									>
										<Input
											placeholder="Discount"
											sx={{ minWidth: '50px' }}
											size="sm"
										/>
										<Select size="sm" sx={{ minWidth: 80 }}>
											<Option value="20">
												<Typography fontSize="body-xs">
													Flat Off
												</Typography>
											</Option>
											<Option value="30">
												<Typography fontSize="body-sx">
													% Off
												</Typography>
											</Option>
										</Select>
									</Grid>
								) : (
									<Button
										variant="solid"
										sx={{
											maxHeight: 6,
											minWidth: 120,
										}}
										onClick={() => {
											const updatedShowDiscountUI = [
												...showDiscountUI,
											];
											updatedShowDiscountUI[index] =
												!updatedShowDiscountUI[index];
											setShowDiscountUI(
												updatedShowDiscountUI
											);
										}}
									>
										Add Discount
									</Button>
								)}
							</Grid>
							<IconButton
								sx={{ ml: 1 }}
								onClick={() =>
									handleRemoveVariant(
										productIndex,
										variant.id
									)
								}
							>
								<ClearIcon />
							</IconButton>
						</Grid>
					))}
				</AccordionDetails>
			</Accordion>
		</Box>
	);
};
