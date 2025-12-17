<script lang="ts">
  interface Props {
    accept?: string;
    onFileSelect: (file: File) => void;
    selectedFile?: File | null;
  }
  
  let { accept = '.glb,.gltf', onFileSelect, selectedFile = null }: Props = $props();
  
  let isDragging = $state(false);
  let inputRef: HTMLInputElement;
  
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }
  
  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }
  
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    
    const file = e.dataTransfer?.files[0];
    if (file && isValidFile(file)) {
      onFileSelect(file);
    }
  }
  
  function handleClick() {
    inputRef?.click();
  }
  
  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }
  
  function isValidFile(file: File): boolean {
    const validExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  }
  
  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

<div
  role="button"
  tabindex="0"
  onclick={handleClick}
  onkeydown={(e) => e.key === 'Enter' && handleClick()}
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
  class="relative p-10 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
         {isDragging 
           ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/5' 
           : selectedFile 
             ? 'border-[var(--accent-olive)] bg-[var(--accent-olive)]/5' 
             : 'border-[var(--border-primary)] bg-[var(--bg-panel-solid)] hover:border-[var(--accent-gold)]/50 hover:bg-[var(--bg-tertiary)]'}"
>
  <input
    bind:this={inputRef}
    type="file"
    {accept}
    onchange={handleFileChange}
    class="hidden"
  />
  
  {#if selectedFile}
    <!-- File Selected State -->
    <div class="text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-olive)]/10 border-2 border-[var(--accent-olive)]/30
                  flex items-center justify-center transition-colors">
        <span class="text-3xl text-[var(--accent-olive)]">✓</span>
      </div>
      <div class="text-lg font-semibold text-[var(--text-primary)] mb-2 transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
        {selectedFile.name}
      </div>
      <div class="text-sm text-[var(--text-muted)] transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
        {formatFileSize(selectedFile.size)}
      </div>
      <div class="mt-5 text-xs text-[var(--text-muted)] italic transition-colors">Click to change file</div>
    </div>
  {:else if isDragging}
    <!-- Dragging State -->
    <div class="text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-gold)]/10 border-2 border-[var(--accent-gold)]/30
                  flex items-center justify-center animate-gentle-pulse transition-colors">
        <span class="text-3xl text-[var(--accent-gold)]">↓</span>
      </div>
      <div class="text-lg text-[var(--accent-gold)]" style="font-family: 'Cormorant Garamond', Georgia, serif;">
        Release to upload
      </div>
    </div>
  {:else}
    <!-- Default State -->
    <div class="text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-tertiary)] border-2 border-[var(--border-secondary)]
                  flex items-center justify-center transition-colors">
        <span class="text-3xl text-[var(--text-muted)]">☉</span>
      </div>
      <div class="text-lg text-[var(--text-primary)] mb-2 transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
        Drop your 3D model here
      </div>
      <div class="text-sm text-[var(--text-muted)] mb-5 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
        or click to browse your files
      </div>
      <div class="inline-block px-4 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] 
                  text-xs text-[var(--text-muted)] tracking-wider transition-colors">
        GLB &middot; GLTF
      </div>
    </div>
  {/if}
</div>
