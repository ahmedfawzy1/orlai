'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Color, Size } from '@/app/types/filter';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/app/components/ui/table';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useFilterStore } from '@/app/store/useFilterStore';
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/app/lib/filters/category';
import { createColor, updateColor, deleteColor } from '@/app/lib/filters/color';
import { createSize, updateSize, deleteSize } from '@/app/lib/filters/size';
import toast from 'react-hot-toast';
import { CheckIcon, XIcon } from 'lucide-react';
import ColorPicker from 'react-pick-color';

export default function CategoriesPage() {
  const { categories, colors, sizes, getFilters } = useFilterStore();

  useEffect(() => {
    getFilters();
  }, [getFilters]);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    slug: '',
  });
  const [newColor, setNewColor] = useState<Partial<Color>>({
    name: '',
    hexCode: '',
  });
  const [newSize, setNewSize] = useState<Partial<Size>>({ name: '' });

  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showColorInput, setShowColorInput] = useState(false);
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempHexCode, setTempHexCode] = useState<string>('');

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategory, setEditingCategory] = useState({
    name: '',
    description: '',
    slug: '',
  });
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [editingColor, setEditingColor] = useState<Partial<Color>>({
    name: '',
    hexCode: '',
  });
  const [showColorPickerEdit, setShowColorPickerEdit] = useState(false);
  const [tempEditHexCode, setTempEditHexCode] = useState<string>('');
  const [editingSizeId, setEditingSizeId] = useState<string | null>(null);
  const [editingSize, setEditingSize] = useState<Partial<Size>>({ name: '' });

  // Selection state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      await getFilters();
      toast.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      const errorMessage =
        error?.response?.data?.message || 'Failed to delete category';
      toast.error(errorMessage);
    }
  };

  const handleDeleteColor = async (colorId: string) => {
    try {
      await deleteColor(colorId);
      await getFilters();
      toast.success('Color deleted successfully');
    } catch (error: any) {
      console.error('Error deleting color:', error);
      const errorMessage =
        error?.response?.data?.message || 'Failed to delete color';
      toast.error(errorMessage);
    }
  };

  const handleDeleteSize = async (sizeId: string) => {
    try {
      await deleteSize(sizeId);
      await getFilters();
      toast.success('Size deleted successfully');
    } catch (error: any) {
      console.error('Error deleting size:', error);
      const errorMessage =
        error?.response?.data?.message || 'Failed to delete size';
      toast.error(errorMessage);
    }
  };

  // Bulk delete handlers
  const handleBulkDeleteCategories = async () => {
    try {
      const results = await Promise.allSettled(
        selectedCategories.map(id => deleteCategory(id)),
      );

      const successful = results.filter(
        result => result.status === 'fulfilled',
      ).length;
      const failed = results.filter(
        result => result.status === 'rejected',
      ).length;

      if (failed === 0) {
        toast.success('Selected categories deleted successfully');
        setSelectedCategories([]);
        await getFilters(); // Refresh the data
      } else if (successful === 0) {
        // All failed
        const firstError = results.find(
          result => result.status === 'rejected',
        ) as PromiseRejectedResult;
        const errorMessage =
          firstError.reason?.response?.data?.message ||
          'Failed to delete categories';
        toast.error(errorMessage);
      } else {
        // Some succeeded, some failed
        toast.error(
          `${successful} categories deleted, ${failed} failed to delete`,
        );
        setSelectedCategories([]);
        await getFilters(); // Refresh the data
      }
    } catch (error: any) {
      console.error('Error deleting selected categories:', error);
      const errorMessage =
        error?.response?.data?.message ||
        'Failed to delete selected categories';
      toast.error(errorMessage);
    }
  };

  const handleBulkDeleteColors = async () => {
    try {
      const results = await Promise.allSettled(
        selectedColors.map(id => deleteColor(id)),
      );

      const successful = results.filter(
        result => result.status === 'fulfilled',
      ).length;
      const failed = results.filter(
        result => result.status === 'rejected',
      ).length;

      if (failed === 0) {
        toast.success('Selected colors deleted successfully');
        setSelectedColors([]);
        await getFilters();
      } else if (successful === 0) {
        const firstError = results.find(
          result => result.status === 'rejected',
        ) as PromiseRejectedResult;
        const errorMessage =
          firstError.reason?.response?.data?.message ||
          'Failed to delete colors';
        toast.error(errorMessage);
      } else {
        toast.error(`${successful} colors deleted, ${failed} failed to delete`);
        setSelectedColors([]);
        await getFilters();
      }
    } catch (error: any) {
      console.error('Error deleting selected colors:', error);
      const errorMessage =
        error?.response?.data?.message || 'Failed to delete selected colors';
      toast.error(errorMessage);
    }
  };

  const handleBulkDeleteSizes = async () => {
    try {
      const results = await Promise.allSettled(
        selectedSizes.map(id => deleteSize(id)),
      );

      const successful = results.filter(
        result => result.status === 'fulfilled',
      ).length;
      const failed = results.filter(
        result => result.status === 'rejected',
      ).length;

      if (failed === 0) {
        toast.success('Selected sizes deleted successfully');
        setSelectedSizes([]);
        await getFilters();
      } else if (successful === 0) {
        const firstError = results.find(
          result => result.status === 'rejected',
        ) as PromiseRejectedResult;
        const errorMessage =
          firstError.reason?.response?.data?.message ||
          'Failed to delete sizes';
        toast.error(errorMessage);
      } else {
        toast.error(`${successful} sizes deleted, ${failed} failed to delete`);
        setSelectedSizes([]);
        await getFilters();
      }
    } catch (error: any) {
      console.error('Error deleting selected sizes:', error);
      const errorMessage =
        error?.response?.data?.message || 'Failed to delete selected sizes';
      toast.error(errorMessage);
    }
  };

  // Selection handlers
  const handleSelectAllCategories = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map(c => c._id || ''));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const handleSelectAllColors = (checked: boolean) => {
    if (checked) {
      setSelectedColors(colors.map(c => c._id || ''));
    } else {
      setSelectedColors([]);
    }
  };

  const handleSelectColor = (colorId: string, checked: boolean) => {
    if (checked) {
      setSelectedColors(prev => [...prev, colorId]);
    } else {
      setSelectedColors(prev => prev.filter(id => id !== colorId));
    }
  };

  const handleSelectAllSizes = (checked: boolean) => {
    if (checked) {
      setSelectedSizes(sizes.map(s => s._id || ''));
    } else {
      setSelectedSizes([]);
    }
  };

  const handleSelectSize = (sizeId: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes(prev => [...prev, sizeId]);
    } else {
      setSelectedSizes(prev => prev.filter(id => id !== sizeId));
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name || !newCategory.description || !newCategory.slug) {
        toast.error('Please fill all fields');
        return;
      }
      await createCategory(newCategory);
      await getFilters();
      setNewCategory({ name: '', description: '', slug: '' });
      setShowCategoryInput(false);
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleAddColor = async () => {
    try {
      if (!newColor.name || !newColor.hexCode) {
        toast.error('Please fill all fields');
        return;
      }
      const colorData: Color = {
        _id: '',
        name: newColor.name,
        hexCode: newColor.hexCode,
        __v: 0,
      };
      await createColor(colorData);
      await getFilters();
      setNewColor({ name: '', hexCode: '' });
      setShowColorInput(false);
      toast.success('Color added successfully');
    } catch (error) {
      console.error('Error adding color:', error);
      toast.error('Failed to add color');
    }
  };

  const handleAddSize = async () => {
    try {
      if (!newSize.name) {
        toast.error('Please enter a size name');
        return;
      }
      const sizeData: Size = {
        _id: '',
        name: newSize.name,
        __v: 0,
      };
      await createSize(sizeData);
      await getFilters();
      setNewSize({ name: '' });
      setShowSizeInput(false);
      toast.success('Size added successfully');
    } catch (error) {
      console.error('Error adding size:', error);
      toast.error('Failed to add size');
    }
  };

  // CATEGORY EDIT HANDLERS
  const handleEditCategory = (cat: any) => {
    setEditingCategoryId(cat._id);
    setEditingCategory({
      name: cat.name,
      description: cat.description,
      slug: cat.slug,
    });
  };
  const handleSaveCategory = async (id: string) => {
    try {
      await updateCategory(id, editingCategory);
      setEditingCategoryId(null);
      toast.success('Category updated successfully');
      await getFilters();
    } catch {
      toast.error('Failed to update category');
    }
  };
  const handleCancelCategory = () => {
    setEditingCategoryId(null);
  };

  // COLOR EDIT HANDLERS
  const handleEditColor = (color: any) => {
    setEditingColorId(color._id);
    setEditingColor({ name: color.name, hexCode: color.hexCode });
  };
  const handleSaveColor = async (id: string) => {
    try {
      await updateColor(id, editingColor);
      setEditingColorId(null);
      toast.success('Color updated successfully');
      await getFilters();
    } catch {
      toast.error('Failed to update color');
    }
  };
  const handleCancelColor = () => {
    setEditingColorId(null);
    setShowColorPickerEdit(false);
  };

  // SIZE EDIT HANDLERS
  const handleEditSize = (size: any) => {
    setEditingSizeId(size._id);
    setEditingSize({ name: size.name });
  };
  const handleSaveSize = async (id: string) => {
    try {
      await updateSize(id, editingSize);
      setEditingSizeId(null);
      toast.success('Size updated successfully');
      await getFilters();
    } catch {
      toast.error('Failed to update size');
    }
  };
  const handleCancelSize = () => {
    setEditingSizeId(null);
  };

  return (
    <div className='px-4 py-6 space-y-6'>
      <div className=''>
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-2xl font-bold'>Categories</h1>
          <div className='flex gap-2'>
            {selectedCategories.length > 0 && (
              <Button
                variant='destructive'
                onClick={handleBulkDeleteCategories}
                className='h-8'
              >
                Delete Selected ({selectedCategories.length})
              </Button>
            )}
            <Button
              onClick={() => setShowCategoryInput(!showCategoryInput)}
              className='inline-flex items-center justify-center gap-2 whitespace-nowrap h-9 px-4 py-2 rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
            >
              {showCategoryInput ? 'Cancel' : 'Add Category'}
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={
                        selectedCategories.length === categories.length &&
                        categories.length > 0
                      }
                      onCheckedChange={handleSelectAllCategories}
                    />
                  </TableHead>
                  <TableHead>NAME</TableHead>
                  <TableHead>DESCRIPTION</TableHead>
                  <TableHead>SLUG</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showCategoryInput && (
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder='Category name'
                        value={newCategory.name}
                        onChange={e =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                        className='h-8 !ring-0'
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder='Description'
                        value={newCategory.description}
                        onChange={e =>
                          setNewCategory({
                            ...newCategory,
                            description: e.target.value,
                          })
                        }
                        className='h-8 !ring-0'
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder='Slug'
                        value={newCategory.slug}
                        onChange={e =>
                          setNewCategory({
                            ...newCategory,
                            slug: e.target.value,
                          })
                        }
                        className='h-8 !ring-0'
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={handleAddCategory}>Add</Button>
                    </TableCell>
                  </TableRow>
                )}
                {categories.map(category => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCategories.includes(
                          category._id || '',
                        )}
                        onCheckedChange={checked =>
                          handleSelectCategory(
                            category._id || '',
                            checked as boolean,
                          )
                        }
                      />
                    </TableCell>
                    {editingCategoryId === category._id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editingCategory.name}
                            onChange={e =>
                              setEditingCategory({
                                ...editingCategory,
                                name: e.target.value,
                              })
                            }
                            className='h-8 !ring-0'
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingCategory.description}
                            onChange={e =>
                              setEditingCategory({
                                ...editingCategory,
                                description: e.target.value,
                              })
                            }
                            className='h-8 !ring-0'
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingCategory.slug}
                            onChange={e =>
                              setEditingCategory({
                                ...editingCategory,
                                slug: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Button
                              size='sm'
                              onClick={() => handleSaveCategory(category._id!)}
                            >
                              Save
                            </Button>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={handleCancelCategory}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Link
                              href={`/admin/categories/edit/${category._id}`}
                              className='text-blue-600 hover:underline'
                              onClick={e => {
                                e.preventDefault();
                                handleEditCategory(category);
                              }}
                            >
                              Edit
                            </Link>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-red-600'
                              onClick={() =>
                                handleDeleteCategory(category._id || '')
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className=''>
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-2xl font-bold'>Colors</h1>
          <div className='flex gap-2'>
            {selectedColors.length > 0 && (
              <Button
                variant='destructive'
                onClick={handleBulkDeleteColors}
                className='h-8'
              >
                Delete Selected ({selectedColors.length})
              </Button>
            )}
            <Button
              onClick={() => setShowColorInput(!showColorInput)}
              className='inline-flex items-center justify-center gap-2 whitespace-nowrap h-9 px-4 py-2 rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
            >
              {showColorInput ? 'Cancel' : 'Add Color'}
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-8'>
                    <Checkbox
                      checked={
                        selectedColors.length === colors.length &&
                        colors.length > 0
                      }
                      onCheckedChange={handleSelectAllColors}
                    />
                  </TableHead>
                  <TableHead>NAME</TableHead>
                  <TableHead className='text-center'>HEX CODE</TableHead>
                  <TableHead className='text-center'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showColorInput && (
                  <TableRow>
                    <TableCell className='w-8'>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder='Color name'
                        value={newColor.name}
                        onChange={e =>
                          setNewColor({ ...newColor, name: e.target.value })
                        }
                        className='h-8 !ring-0'
                      />
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='relative'>
                        {newColor.hexCode ? (
                          <button
                            type='button'
                            onClick={() => {
                              setTempHexCode(newColor.hexCode || '#ffffff');
                              setShowColorPicker(true);
                            }}
                            className='text-blue-600 hover:underline'
                          >
                            {newColor.hexCode}
                          </button>
                        ) : (
                          <Button
                            type='button'
                            onClick={() => {
                              setTempHexCode(newColor.hexCode || '#ffffff');
                              setShowColorPicker(true);
                            }}
                            className='bg-primary rounded-lg text-center text-[14px] px-3 py-1 cursor-pointer hover:bg-primary/90 transition-all duration-200'
                          >
                            Select Color
                          </Button>
                        )}
                        {showColorPicker && (
                          <div className='absolute z-10 mt-2'>
                            <div className='bg-white pt-1 rounded-lg shadow-lg'>
                              <div className='flex justify-end items-center'>
                                <button
                                  type='button'
                                  onClick={() => setShowColorPicker(false)}
                                  className='p-1 cursor-pointer'
                                >
                                  <XIcon size={16} />
                                </button>
                                <button
                                  type='button'
                                  onClick={() => {
                                    setNewColor({
                                      ...newColor,
                                      hexCode: tempHexCode,
                                    });
                                    setShowColorPicker(false);
                                  }}
                                  className='p-1 cursor-pointer'
                                >
                                  <CheckIcon size={16} />
                                </button>
                              </div>
                              <ColorPicker
                                color={tempHexCode}
                                onChange={color => setTempHexCode(color.hex)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex items-center gap-2 justify-center'>
                        <Button onClick={handleAddColor}>Add</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {colors.map(color => (
                  <TableRow key={color._id}>
                    <TableCell className='w-8'>
                      <Checkbox
                        checked={selectedColors.includes(color._id || '')}
                        onCheckedChange={checked =>
                          handleSelectColor(color._id || '', checked as boolean)
                        }
                      />
                    </TableCell>
                    {editingColorId === color._id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editingColor.name}
                            onChange={e =>
                              setEditingColor({
                                ...editingColor,
                                name: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell className='text-center'>
                          <div className='relative flex flex-row-reverse items-center gap-2 justify-center'>
                            {editingColor.hexCode ? (
                              <button
                                type='button'
                                onClick={() => {
                                  setTempEditHexCode(
                                    editingColor.hexCode || '#ffffff',
                                  );
                                  setShowColorPickerEdit(true);
                                }}
                                className='text-blue-600 hover:underline text-center w-20 font-mono'
                              >
                                {editingColor.hexCode}
                              </button>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setTempEditHexCode(
                                    editingColor.hexCode || '#ffffff',
                                  );
                                  setShowColorPickerEdit(true);
                                }}
                                className='bg-[#efefef] rounded-lg text-center text-[14px] px-3 py-1 cursor-pointer hover:bg-[#e2e2e2] transition-all duration-200'
                              >
                                Select Color
                              </Button>
                            )}
                            {showColorPickerEdit && (
                              <div className='absolute z-50 mt-2'>
                                <div className='bg-white pt-1 rounded-lg shadow-lg'>
                                  <div className='flex justify-end items-center'>
                                    <button
                                      type='button'
                                      onClick={() =>
                                        setShowColorPickerEdit(false)
                                      }
                                      className='p-1 cursor-pointer'
                                    >
                                      <XIcon size={16} />
                                    </button>
                                    <button
                                      type='button'
                                      onClick={() => {
                                        setEditingColor({
                                          ...editingColor,
                                          hexCode: tempEditHexCode,
                                        });
                                        setShowColorPickerEdit(false);
                                      }}
                                      className='p-1 cursor-pointer'
                                    >
                                      <CheckIcon size={16} />
                                    </button>
                                  </div>
                                  <ColorPicker
                                    color={tempEditHexCode}
                                    onChange={color =>
                                      setTempEditHexCode(color.hex)
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {editingColor.hexCode && (
                              <div
                                className='w-6 h-6 rounded-full border ml-2'
                                style={{
                                  backgroundColor: editingColor.hexCode,
                                }}
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='text-center'>
                          <div className='flex items-center gap-2 justify-center'>
                            <Button
                              size='sm'
                              onClick={() => handleSaveColor(color._id!)}
                            >
                              Save
                            </Button>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={handleCancelColor}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{color.name}</TableCell>
                        <TableCell className='text-center'>
                          <div className='flex items-center gap-2 justify-center'>
                            <div
                              className='w-6 h-6 rounded-full border'
                              style={{ backgroundColor: color.hexCode }}
                            />
                            <span className='text-center w-14 font-mono'>
                              {color.hexCode}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='text-center'>
                          <div className='flex items-center gap-2 justify-center'>
                            <Link
                              href={`/admin/colors/edit/${color._id}`}
                              className='text-blue-600 hover:underline'
                              onClick={e => {
                                e.preventDefault();
                                handleEditColor(color);
                              }}
                            >
                              Edit
                            </Link>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-red-600'
                              onClick={() => handleDeleteColor(color._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className=''>
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-2xl font-bold'>Sizes</h1>
          <div className='flex gap-2'>
            {selectedSizes.length > 0 && (
              <Button
                variant='destructive'
                onClick={handleBulkDeleteSizes}
                className='h-8'
              >
                Delete Selected ({selectedSizes.length})
              </Button>
            )}
            <Button
              onClick={() => setShowSizeInput(!showSizeInput)}
              className='inline-flex items-center justify-center gap-2 whitespace-nowrap h-9 px-4 py-2 rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
            >
              {showSizeInput ? 'Cancel' : 'Add Size'}
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={
                        selectedSizes.length === sizes.length &&
                        sizes.length > 0
                      }
                      onCheckedChange={handleSelectAllSizes}
                    />
                  </TableHead>
                  <TableHead>NAME</TableHead>
                  <TableHead className='text-center'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showSizeInput && (
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder='Size name'
                        value={newSize.name}
                        onChange={e => setNewSize({ name: e.target.value })}
                        className='h-8 !ring-0'
                      />
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex justify-center'>
                        <Button onClick={handleAddSize}>Add</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {sizes.map(size => (
                  <TableRow key={size._id}>
                    <TableCell className='w-8'>
                      <Checkbox
                        checked={selectedSizes.includes(size._id || '')}
                        onCheckedChange={checked =>
                          handleSelectSize(size._id || '', checked as boolean)
                        }
                      />
                    </TableCell>
                    {editingSizeId === size._id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editingSize.name}
                            onChange={e =>
                              setEditingSize({ name: e.target.value })
                            }
                            className='h-8 !ring-0'
                          />
                        </TableCell>
                        <TableCell className='text-center'>
                          <div className='flex justify-center items-center gap-2'>
                            <Button
                              size='sm'
                              onClick={() => handleSaveSize(size._id!)}
                            >
                              Save
                            </Button>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={handleCancelSize}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{size.name}</TableCell>
                        <TableCell className='text-center'>
                          <div className='flex justify-center items-center gap-2'>
                            <Link
                              href={`/admin/sizes/edit/${size._id}`}
                              className='text-blue-600 hover:underline'
                              onClick={e => {
                                e.preventDefault();
                                handleEditSize(size);
                              }}
                            >
                              Edit
                            </Link>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-red-600 ml-2'
                              onClick={() => handleDeleteSize(size._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
