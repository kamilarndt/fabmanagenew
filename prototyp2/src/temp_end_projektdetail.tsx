// Znajduję koniec pliku ProjektDetail.tsx gdzie jest TileEditModal

{/* Tile Edit Modal */}
<TileEditModal
  open={showTileModal}
  onOpenChange={setShowTileModal}
  onSave={handleSaveTile}
  editingTile={editingTile}
  zones={zones}
  statuses={statuses}
  assignableMembers={assignableMembers}
  materials={materials}
/>

{/* Edit Project Modal */}
<EditProjectModal
  open={showEditModal}
  onOpenChange={setShowEditModal}
  onSave={handleSaveProject}
  editingProject={activeProject}
/>
    </div>
  );
}