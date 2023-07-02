package com.meinsms.backend.repository;

import com.meinsms.backend.models.Category;
import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.FilesFolders;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilesFoldersRepository extends JpaRepository<FilesFolders, Long> {

    List<FilesFolders> findByCategoriesAndClasses(Category category, Classes classes, Sort sort);

    @Query("FROM FilesFolders ff WHERE ff.parent=:parent ORDER BY ff.important DESC, ff.name ASC")
    List<FilesFolders> findByParent(FilesFolders parent, Sort sort);

//    @Query("FROM FilesFolders ff WHERE ff.isRoot = :isRoot AND ff.classes = :classes AND ff.category = :category ORDER BY ff.important DESC, ff.name ASC")
//    List<FilesFolders>  findByIsRootAndClassesAndCategory(boolean isRoot, Classes classes, Category category, Sort sort);
}
