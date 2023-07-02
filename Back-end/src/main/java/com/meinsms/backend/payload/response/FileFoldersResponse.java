package com.meinsms.backend.payload.response;

import com.meinsms.backend.models.FilesFolders;
import lombok.Data;

import java.util.List;

@Data
public class FileFoldersResponse {
    private Long id;

    private String type;

    private String status;

    private String name;

    private String file_path;

    private boolean important;

    private boolean allowed;

    private boolean isParent;

    private boolean isRoot;

    private String teacher;

    private String className;

    private String studentName;

    private String categoryName;

    private int numOfChild;

    private List<FilesFolders> children;
}
