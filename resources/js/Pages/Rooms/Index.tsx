import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Bed, Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

export default function Index({ rooms, filters }: any) {
    const { data: searchData, setData: setSearchData, get } = useForm({
        q: filters.q || '',
    });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<any>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        class: '',
        capacity: 0,
        available: 0,
        is_bpjs: false,
    });

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        get(route('rooms.index'), { preserveState: true });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kamar ini?')) {
            useForm().delete(route('rooms.destroy', id));
        }
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setIsCreateOpen(true);
    };

    const openEditModal = (room: any) => {
        clearErrors();
        setCurrentRoom(room);
        setData({
            name: room.name,
            class: room.class,
            capacity: room.capacity,
            available: room.available,
            is_bpjs: room.is_bpjs,
        });
        setIsEditOpen(true);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rooms.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            }
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentRoom) return;
        put(route('rooms.update', currentRoom.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                reset();
            }
        });
    };

    return (
        <AdminLayout title="Manajemen Kamar & BPJS">
            <Head title="Manajemen Kamar & BPJS" />

            <div className="p-6 space-y-6 bg-slate-50/50 min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            <Bed className="h-6 w-6 text-blue-600" />
                            Kamar & BPJS
                        </h2>
                        <p className="text-sm text-slate-500">
                            Kelola ketersediaan kamar rawat inap dan status BPJS.
                        </p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 shadow-none">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kamar
                    </Button>
                </div>

                <Card className="border border-slate-200 shadow-none overflow-hidden bg-white">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/30 px-6 py-4">
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Cari nama kamar atau kelas..."
                                    value={searchData.q}
                                    onChange={(e) => setSearchData('q', e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="pl-9 bg-white border-slate-300 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <Button variant="secondary" onClick={() => handleSearch()}>
                                Cari
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="px-6 py-0">
                        {rooms.data.length === 0 ? (
                            <div className="py-16 text-center text-muted-foreground">
                                <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Bed className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                                    {searchData.q ? `Tidak ada kamar untuk "${searchData.q}"` : 'Belum ada data kamar'}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                                    {searchData.q ? 'Coba cari dengan nama atau kelas lain.' : 'Tambahkan data kamar untuk menampilkannya di sini.'}
                                </p>
                                <Button onClick={openCreateModal} className="mt-6 bg-blue-600 hover:bg-blue-700 shadow-sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Kamar
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                <TableHead className="font-semibold text-slate-700 pl-6 w-[250px]">Nama Kamar</TableHead>
                                                <TableHead className="font-semibold text-slate-700">Kelas</TableHead>
                                                <TableHead className="font-semibold text-slate-700">Kapasitas</TableHead>
                                                <TableHead className="font-semibold text-slate-700">Tersedia</TableHead>
                                                <TableHead className="font-semibold text-slate-700">Status BPJS</TableHead>
                                                <TableHead className="font-semibold text-slate-700 text-right pr-6 w-[120px]">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rooms.data.map((room: any) => (
                                                <TableRow key={room.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <TableCell className="font-medium text-slate-900 pl-6 py-4">{room.name}</TableCell>
                                                    <TableCell>{room.class}</TableCell>
                                                    <TableCell>{room.capacity} Kasur</TableCell>
                                                    <TableCell>
                                                        <span className={`font-semibold ${room.available > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                            {room.available} Kosong
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {room.is_bpjs ? (
                                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Menerima BPJS</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-slate-500 border-slate-200">Non-BPJS</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => openEditModal(room)} className="text-slate-500 hover:text-blue-600 h-8 w-8">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDelete(room.id)}
                                                                className="text-slate-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                
                                {rooms.links && rooms.links.length > 3 && (
                                    <div className="p-4 border-t flex flex-wrap justify-center gap-1 bg-slate-50">
                                        {rooms.links.map((link: any, k: number) => (
                                            <Link
                                                key={k}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 rounded-md text-sm transition-colors ${link.active ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Kamar */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleCreateSubmit}>
                        <DialogHeader>
                            <DialogTitle>Tambah Kamar</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Kamar</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Mawar 1"
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class">Kelas</Label>
                                <Input
                                    id="class"
                                    value={data.class}
                                    onChange={(e) => setData('class', e.target.value)}
                                    placeholder="Contoh: VIP / Kelas 1"
                                />
                                {errors.class && <p className="text-sm text-red-600">{errors.class}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Total Kapasitas</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        min="0"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', parseInt(e.target.value) || 0)}
                                    />
                                    {errors.capacity && <p className="text-sm text-red-600">{errors.capacity}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="available">Kasur Kosong</Label>
                                    <Input
                                        id="available"
                                        type="number"
                                        min="0"
                                        max={data.capacity}
                                        value={data.available}
                                        onChange={(e) => setData('available', parseInt(e.target.value) || 0)}
                                    />
                                    {errors.available && <p className="text-sm text-red-600">{errors.available}</p>}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch
                                    id="is_bpjs"
                                    checked={data.is_bpjs}
                                    onCheckedChange={(checked) => setData('is_bpjs', checked)}
                                />
                                <Label htmlFor="is_bpjs" className="font-semibold text-slate-700 cursor-pointer">
                                    Menerima Pasien BPJS
                                </Label>
                            </div>
                            {errors.is_bpjs && <p className="text-sm text-red-600">{errors.is_bpjs}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">Simpan Kamar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Kamar */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle>Edit Kamar</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nama Kamar</Label>
                                <Input
                                    id="edit-name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-class">Kelas</Label>
                                <Input
                                    id="edit-class"
                                    value={data.class}
                                    onChange={(e) => setData('class', e.target.value)}
                                />
                                {errors.class && <p className="text-sm text-red-600">{errors.class}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-capacity">Total Kapasitas</Label>
                                    <Input
                                        id="edit-capacity"
                                        type="number"
                                        min="0"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', parseInt(e.target.value) || 0)}
                                    />
                                    {errors.capacity && <p className="text-sm text-red-600">{errors.capacity}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-available">Kasur Kosong</Label>
                                    <Input
                                        id="edit-available"
                                        type="number"
                                        min="0"
                                        max={data.capacity}
                                        value={data.available}
                                        onChange={(e) => setData('available', parseInt(e.target.value) || 0)}
                                    />
                                    {errors.available && <p className="text-sm text-red-600">{errors.available}</p>}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch
                                    id="edit-is_bpjs"
                                    checked={data.is_bpjs}
                                    onCheckedChange={(checked) => setData('is_bpjs', checked)}
                                />
                                <Label htmlFor="edit-is_bpjs" className="font-semibold text-slate-700 cursor-pointer">
                                    Menerima Pasien BPJS
                                </Label>
                            </div>
                            {errors.is_bpjs && <p className="text-sm text-red-600">{errors.is_bpjs}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </AdminLayout>
    );
}
